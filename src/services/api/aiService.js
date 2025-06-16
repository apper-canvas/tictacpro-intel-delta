const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AiService {
  async getAIMove(board, difficulty = 'easy', aiPlayer = 'O', humanPlayer = 'X') {
    await delay(300);
    
    const availableMoves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          availableMoves.push({ row: i, col: j });
        }
      }
    }

    if (availableMoves.length === 0) return null;

    switch (difficulty) {
      case 'easy':
        return this.getEasyMove(availableMoves);
      case 'medium':
        return this.getMediumMove(board, availableMoves, aiPlayer, humanPlayer);
      case 'hard':
        return this.getHardMove(board, availableMoves, aiPlayer, humanPlayer);
      default:
        return this.getEasyMove(availableMoves);
    }
  }

  getEasyMove(availableMoves) {
    // Easy difficulty: completely random move selection
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  getMediumMove(board, availableMoves, aiPlayer, humanPlayer) {
    // Medium difficulty: Check for winning move, then random
    // Check for winning move
    for (const move of availableMoves) {
      const testBoard = board.map(r => [...r]);
      testBoard[move.row][move.col] = aiPlayer;
      if (this.checkWinner(testBoard) === aiPlayer) {
        return move;
      }
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  getHardMove(board, availableMoves, aiPlayer, humanPlayer) {
    // Hard difficulty: Full strategic play
    // Check for winning move
    for (const move of availableMoves) {
      const testBoard = board.map(r => [...r]);
      testBoard[move.row][move.col] = aiPlayer;
      if (this.checkWinner(testBoard) === aiPlayer) {
        return move;
      }
    }

    // Check for blocking move
    for (const move of availableMoves) {
      const testBoard = board.map(r => [...r]);
      testBoard[move.row][move.col] = humanPlayer;
      if (this.checkWinner(testBoard) === humanPlayer) {
        return move;
      }
    }

    // Take center if available
    if (board[1][1] === '') {
      return { row: 1, col: 1 };
    }

    // Take corners
    const corners = [{ row: 0, col: 0 }, { row: 0, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 2 }];
    const availableCorners = corners.filter(corner => 
      board[corner.row][corner.col] === ''
    );
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
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
}

export default new AiService();