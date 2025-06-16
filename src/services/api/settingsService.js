import { toast } from 'react-toastify';

// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

class SettingsService {
  async getSettings() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'sound_enabled', 'ai_difficulty', 'player_x_name', 'player_o_name']
      };
      
      const response = await apperClient.fetchRecords('settings', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      // Return first settings record or default values
      if (response.data && response.data.length > 0) {
        const settings = response.data[0];
        return {
          soundEnabled: settings.sound_enabled,
          aiDifficulty: settings.ai_difficulty,
          playerXName: settings.player_x_name,
          playerOName: settings.player_o_name
        };
      }
      
      return {
        soundEnabled: true,
        aiDifficulty: 'medium',
        playerXName: 'Player X',
        playerOName: 'Player O'
      };
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
      return null;
    }
  }

  async updateSettings(newSettings) {
    try {
      // Map UI field names to database field names
      const updateData = {
        sound_enabled: newSettings.soundEnabled,
        ai_difficulty: newSettings.aiDifficulty,
        player_x_name: newSettings.playerXName,
        player_o_name: newSettings.playerOName
      };

      // Get existing settings to find record ID
      const existing = await this.getSettings();
      if (!existing) {
        // Create new settings record
        const params = {
          records: [updateData]
        };
        
        const response = await apperClient.createRecord('settings', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return newSettings;
          } else {
            if (result.message) toast.error(result.message);
            return null;
          }
        }
      } else {
        // Update existing record - assuming ID 1 for simplicity
        const params = {
          records: [{
            Id: 1,
            ...updateData
          }]
        };
        
        const response = await apperClient.updateRecord('settings', params);
        
        if (!response.success) {
          console.error(response.message);
          toast.error(response.message);
          return null;
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return newSettings;
          } else {
            if (result.message) toast.error(result.message);
            return null;
          }
        }
      }
      
      return newSettings;
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
      return null;
    }
  }
}

export default new SettingsService();