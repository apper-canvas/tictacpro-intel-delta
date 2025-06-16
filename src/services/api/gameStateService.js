import gameStateData from '../mockData/gameState.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameStateService {
  constructor() {
    this.data = { ...gameStateData };
  }

  async getGameState() {
    await delay(100);
    return { ...this.data };
  }

  async updateGameState(newState) {
    await delay(150);
    this.data = { ...this.data, ...newState };
    return { ...this.data };
  }

  async resetGame() {
    await delay(200);
    this.data = {
      ...this.data,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      currentPlayer: 'X',
      winner: null,
      winningCells: null,
      isDraw: false
    };
    return { ...this.data };
  }

  async makeMove(row, col, player) {
    await delay(100);
    const newBoard = this.data.board.map(r => [...r]);
    newBoard[row][col] = player;
    
    const winner = this.checkWinner(newBoard);
    const winningCells = winner ? this.getWinningCells(newBoard) : null;
    const isDraw = !winner && this.isBoardFull(newBoard);
    
    this.data = {
      ...this.data,
      board: newBoard,
      currentPlayer: player === 'X' ? 'O' : 'X',
      winner,
      winningCells,
      isDraw
    };
    
    return { ...this.data };
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

  async getAIMove() {
    await delay(300);
    const availableMoves = [];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.data.board[i][j] === '') {
          availableMoves.push({ row: i, col: j });
        }
      }
    }

    if (availableMoves.length === 0) return null;

    // Simple AI: Check for winning move first, then blocking move, then random
    const aiPlayer = 'O';
    const humanPlayer = 'X';

    // Check for winning move
    for (const move of availableMoves) {
      const testBoard = this.data.board.map(r => [...r]);
      testBoard[move.row][move.col] = aiPlayer;
      if (this.checkWinner(testBoard) === aiPlayer) {
        return move;
      }
    }

    // Check for blocking move
    for (const move of availableMoves) {
      const testBoard = this.data.board.map(r => [...r]);
      testBoard[move.row][move.col] = humanPlayer;
      if (this.checkWinner(testBoard) === humanPlayer) {
        return move;
      }
    }

    // Take center if available
    if (this.data.board[1][1] === '') {
      return { row: 1, col: 1 };
    }

    // Take corners
    const corners = [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }];
    const availableCorners = corners.filter(corner => 
      this.data.board[corner.row][corner.col] === ''
    );
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }
}

export default new GameStateService();