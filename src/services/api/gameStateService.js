import { toast } from 'react-toastify';
import aiService from './aiService.js';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

// Mock data for fallback - when database is unavailable or returns errors
const mockGameState = {
  board: [['', '', ''], ['', '', ''], ['', '', '']],
  currentPlayer: 'X',
  winner: null,
  winningCells: [],
class GameStateService {
  
  async getGameState() {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'board', 'current_player', 'winner', 'winning_cells', 'is_draw', 'game_mode']
      };
      
      const response = await apperClient.fetchRecords('game_state', params);
      
      if (!response.success) {
        console.error('Fetch error:', response.message);
        // If no records exist, create a default one
        return await this.createDefaultGameState();
      }
      
      // Return first game state record or create default if none exist
      if (response.data && response.data.length > 0) {
        const gameState = response.data[0];
        return this.formatGameStateFromDB(gameState);
      }
      
      // No existing game state, create default
      return await this.createDefaultGameState();
    } catch (error) {
      console.error("Error fetching game state:", error);
      // Try to create default game state as fallback
      return await this.createDefaultGameState();
    }
  }

  async createDefaultGameState() {
    try {
      const defaultGameState = {
        Name: 'Default Game',
        board: JSON.stringify([['', '', ''], ['', '', ''], ['', '', '']]),
        current_player: 'X',
        winner: '',
        winning_cells: JSON.stringify([]),
        is_draw: false,
        game_mode: 'two-player'
      };

      const params = {
        records: [defaultGameState]
      };

      const response = await apperClient.createRecord('game_state', params);
      
      if (response.success && response.results && response.results[0].success) {
        const createdRecord = response.results[0].data;
        return this.formatGameStateFromDB(createdRecord);
      } else {
        console.error('Failed to create default game state:', response);
        return this.getDefaultGameStateObject();
      }
    } catch (error) {
      console.error('Error creating default game state:', error);
      return this.getDefaultGameStateObject();
    }
  }

  formatGameStateFromDB(gameState) {
    return {
      id: gameState.Id,
      board: gameState.board ? JSON.parse(gameState.board) : [['', '', ''], ['', '', ''], ['', '', '']],
      currentPlayer: gameState.current_player || 'X',
      winner: gameState.winner || null,
      winningCells: gameState.winning_cells ? JSON.parse(gameState.winning_cells) : [],
      isDraw: gameState.is_draw || false,
      gameMode: gameState.game_mode || 'two-player'
    };
  }

  getDefaultGameStateObject() {
    return {
      board: [['', '', ''], ['', '', ''], ['', '', '']],
      currentPlayer: 'X',
      winner: null,
      winningCells: [],
      isDraw: false,
      gameMode: 'two-player'
    };
  }

  async makeMove(row, col, player) {
    try {
      // Get current game state
      const currentState = await this.getGameState();
      if (!currentState) {
        toast.error('Failed to load current game state');
        return null;
      }

      // Make the move
      const newBoard = currentState.board.map(r => [...r]);
      newBoard[row][col] = player;

      // Check for winner
      const { winner, winningCells } = this.checkWinner(newBoard);
      const isDraw = !winner && this.isBoardFull(newBoard);
      const nextPlayer = winner || isDraw ? currentState.currentPlayer : (player === 'X' ? 'O' : 'X');

      const updatedGameState = {
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: winner,
        winningCells: winningCells || [],
        isDraw: isDraw,
        gameMode: currentState.gameMode
      };

      // Save to database
      const savedState = await this.saveGameState(updatedGameState, currentState.id);
      return savedState || updatedGameState;
    } catch (error) {
      console.error('Error making move:', error);
      toast.error('Failed to make move');
      return null;
    }
  }

  async saveGameState(gameState, existingId = null) {
    try {
      const dbGameState = {
        board: JSON.stringify(gameState.board),
        current_player: gameState.currentPlayer,
        winner: gameState.winner || '',
        winning_cells: JSON.stringify(gameState.winningCells || []),
        is_draw: gameState.isDraw,
        game_mode: gameState.gameMode
      };

      if (existingId) {
        // Update existing record
        const params = {
          records: [{
            Id: existingId,
            ...dbGameState
          }]
        };

        const response = await apperClient.updateRecord('game_state', params);
        
        if (response.success && response.results && response.results[0].success) {
          return this.formatGameStateFromDB(response.results[0].data);
        }
      } else {
        // Create new record
        const params = {
          records: [{
            Name: 'Game State',
            ...dbGameState
          }]
        };

        const response = await apperClient.createRecord('game_state', params);
        
        if (response.success && response.results && response.results[0].success) {
          return this.formatGameStateFromDB(response.results[0].data);
        }
      }

      return null;
    } catch (error) {
      console.error('Error saving game state:', error);
      return null;
    }
  }

  async resetGame() {
    try {
      const currentState = await this.getGameState();
      const resetGameState = {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentPlayer: 'X',
        winner: null,
        winningCells: [],
        isDraw: false,
        gameMode: currentState?.gameMode || 'two-player'
      };

      const savedState = await this.saveGameState(resetGameState, currentState?.id);
      return savedState || resetGameState;
    } catch (error) {
      console.error('Error resetting game:', error);
      toast.error('Failed to reset game');
      return this.getDefaultGameStateObject();
    }
  }

  async updateGameState(updates) {
    try {
      const currentState = await this.getGameState();
      if (!currentState) {
        toast.error('Failed to load current game state');
        return null;
      }

      const updatedGameState = { ...currentState, ...updates };
      const savedState = await this.saveGameState(updatedGameState, currentState.id);
      return savedState || updatedGameState;
    } catch (error) {
      console.error('Error updating game state:', error);
      toast.error('Failed to update game state');
      return null;
    }
  }

  async getAIMove(difficulty) {
    try {
      const currentState = await this.getGameState();
      if (!currentState) {
        toast.error('Failed to load game state for AI move');
        return null;
      }

      const aiMove = await aiService.getAIMove(currentState.board, difficulty);
      return aiMove;
    } catch (error) {
      console.error('Error getting AI move:', error);
      toast.error('Failed to get AI move');
      return null;
    }
  }

  checkWinner(board) {
    const lines = [
      // Rows
      [[0,0], [0,1], [0,2]],
      [[1,0], [1,1], [1,2]],
      [[2,0], [2,1], [2,2]],
      // Columns
      [[0,0], [1,0], [2,0]],
      [[0,1], [1,1], [2,1]],
      [[0,2], [1,2], [2,2]],
      // Diagonals
      [[0,0], [1,1], [2,2]],
      [[0,2], [1,1], [2,0]]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a[0]][a[1]] && 
          board[a[0]][a[1]] === board[b[0]][b[1]] && 
          board[a[0]][a[1]] === board[c[0]][c[1]]) {
        return {
          winner: board[a[0]][a[1]],
          winningCells: line
        };
      }
    }

    return { winner: null, winningCells: null };
  }

  isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== ''));
  }
}

export default new GameStateService();