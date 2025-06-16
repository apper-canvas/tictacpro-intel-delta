import { toast } from 'react-toastify';
import aiService from './aiService.js';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class GameStateService {
  async getGameState() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'board', 'current_player', 'winner', 'winning_cells', 'is_draw', 'game_mode']
      };
      
      const response = await apperClient.fetchRecords('game_state', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Return first game state record or default values
      if (response.data && response.data.length > 0) {
        const gameState = response.data[0];
        return {
          board: gameState.board ? JSON.parse(gameState.board) : [['', '', ''], ['', '', ''], ['', '', '']],
          currentPlayer: gameState.current_player || 'X',
          winner: gameState.winner || null,
          winningCells: gameState.winning_cells ? JSON.parse(gameState.winning_cells) : null,
          isDraw: gameState.is_draw || false,
          gameMode: gameState.game_mode || 'two-player'
        };
      }
      
      return {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentPlayer: 'X',
        winner: null,
        winningCells: null,
        isDraw: false,
        gameMode: 'two-player'
      };
    } catch (error) {
      console.error("Error fetching game state:", error);
      toast.error("Failed to load game state");
      return null;
    }
  }

  async updateGameState(newState) {
    try {
      // Map UI field names to database field names
      const updateData = {};
      
      if (newState.board !== undefined) {
        updateData.board = JSON.stringify(newState.board);
      }
      if (newState.currentPlayer !== undefined) {
        updateData.current_player = newState.currentPlayer;
      }
      if (newState.winner !== undefined) {
        updateData.winner = newState.winner;
      }
      if (newState.winningCells !== undefined) {
        updateData.winning_cells = newState.winningCells ? JSON.stringify(newState.winningCells) : null;
      }
      if (newState.isDraw !== undefined) {
        updateData.is_draw = newState.isDraw;
      }
      if (newState.gameMode !== undefined) {
        updateData.game_mode = newState.gameMode;
      }
      
      const params = {
        records: [{
          Id: 1, // Assuming single game state record with ID 1
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('game_state', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Return updated state by getting current state
          return await this.getGameState();
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return await this.getGameState();
    } catch (error) {
      console.error("Error updating game state:", error);
      toast.error("Failed to update game state");
      return null;
    }
  }

  async resetGame() {
    try {
      const resetData = {
        board: JSON.stringify([['', '', ''], ['', '', ''], ['', '', '']]),
        current_player: 'X',
        winner: null,
        winning_cells: null,
        is_draw: false
      };
      
      const params = {
        records: [{
          Id: 1, // Assuming single game state record with ID 1
          ...resetData
        }]
      };
      
      const response = await apperClient.updateRecord('game_state', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return {
            board: [['', '', ''], ['', '', ''], ['', '', '']],
            currentPlayer: 'X',
            winner: null,
            winningCells: null,
            isDraw: false,
            gameMode: 'two-player'
          };
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return {
        board: [['', '', ''], ['', '', ''], ['', '', '']],
        currentPlayer: 'X',
        winner: null,
        winningCells: null,
        isDraw: false,
        gameMode: 'two-player'
      };
    } catch (error) {
      console.error("Error resetting game:", error);
      toast.error("Failed to reset game");
      return null;
    }
  }

  async makeMove(row, col, player) {
    try {
      // Get current game state
      const currentState = await this.getGameState();
      if (!currentState) return null;
      
      const newBoard = currentState.board.map(r => [...r]);
      newBoard[row][col] = player;
      
      const winner = this.checkWinner(newBoard);
      const winningCells = winner ? this.getWinningCells(newBoard) : null;
      const isDraw = !winner && this.isBoardFull(newBoard);
      
      const newState = {
        board: newBoard,
        currentPlayer: player === 'X' ? 'O' : 'X',
        winner,
        winningCells,
        isDraw,
        gameMode: currentState.gameMode
      };
      
      // Update database
      const updateData = {
        board: JSON.stringify(newBoard),
        current_player: newState.currentPlayer,
        winner: winner,
        winning_cells: winningCells ? JSON.stringify(winningCells) : null,
        is_draw: isDraw
      };
      
      const params = {
        records: [{
          Id: 1, // Assuming single game state record with ID 1
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('game_state', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return newState;
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return newState;
    } catch (error) {
      console.error("Error making move:", error);
      toast.error("Failed to make move");
      return null;
    }
  }

  checkWinner(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    return null;
  }

  getWinningCells(board) {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return [i * 3, i * 3 + 1, i * 3 + 2];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return [i, i + 3, i + 6];
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return [0, 4, 8];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return [2, 4, 6];
    }

    return null;
  }

  isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== ''));
  }

  async getAIMove(difficulty = 'easy') {
    try {
      const currentState = await this.getGameState();
      if (!currentState) return null;
      
      return await aiService.getAIMove(currentState.board, difficulty);
    } catch (error) {
      console.error("Error getting AI move:", error);
      return null;
    }
  }
}

export default new GameStateService();