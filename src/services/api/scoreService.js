import { toast } from 'react-toastify';

// Auto-generated by Apper.io
// This file contains the score service methods
// Use this service to interact with the score table

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY

class ScoreService {
  async getScore() {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'player_x', 'player_o', 'draws']
      };
      
      const response = await apperClient.fetchRecords('score', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Return first score record or default values
      if (response.data && response.data.length > 0) {
        const score = response.data[0];
        return {
          playerX: score.player_x || 0,
          playerO: score.player_o || 0,
          draws: score.draws || 0
        };
      }
      
      return { playerX: 0, playerO: 0, draws: 0 };
    } catch (error) {
      console.error("Error fetching score:", error);
      toast.error("Failed to load score");
      return null;
    }
  }

  async updateScore(winner) {
    try {
      // Get current score
      const currentScore = await this.getScore();
      if (!currentScore) return null;
      
      // Update score based on winner
      let updatedScore = { ...currentScore };
      if (winner === 'X') {
        updatedScore.playerX++;
      } else if (winner === 'O') {
        updatedScore.playerO++;
      } else if (winner === 'draw') {
        updatedScore.draws++;
      }
      
      // Map to database field names
      const updateData = {
        player_x: updatedScore.playerX,
        player_o: updatedScore.playerO,
        draws: updatedScore.draws
      };
      
      const params = {
        records: [{
          Id: 1, // Assuming single score record with ID 1
          ...updateData
        }]
      };
      
      const response = await apperClient.updateRecord('score', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return updatedScore;
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return updatedScore;
    } catch (error) {
      console.error("Error updating score:", error);
      toast.error("Failed to update score");
      return null;
    }
  }

  async resetScore() {
    try {
      const resetData = {
        player_x: 0,
        player_o: 0,
        draws: 0
      };
      
      const params = {
        records: [{
          Id: 1, // Assuming single score record with ID 1
          ...resetData
        }]
      };
      
      const response = await apperClient.updateRecord('score', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { playerX: 0, playerO: 0, draws: 0 };
        } else {
          if (result.message) toast.error(result.message);
          return null;
        }
      }
      
      return { playerX: 0, playerO: 0, draws: 0 };
    } catch (error) {
      console.error("Error resetting score:", error);
      toast.error("Failed to reset score");
      return null;
    }
  }
}

export default new ScoreService();

export default new ScoreService();