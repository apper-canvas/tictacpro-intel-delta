import scoreData from '../mockData/score.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ScoreService {
  constructor() {
    this.data = { ...scoreData };
  }

  async getScore() {
    await delay(100);
    return { ...this.data };
  }

  async updateScore(winner) {
    await delay(150);
    if (winner === 'X') {
      this.data.playerX++;
    } else if (winner === 'O') {
      this.data.playerO++;
    } else if (winner === 'draw') {
      this.data.draws++;
    }
    return { ...this.data };
  }

  async resetScore() {
    await delay(200);
    this.data = {
      playerX: 0,
      playerO: 0,
      draws: 0
    };
    return { ...this.data };
  }
}

export default new ScoreService();