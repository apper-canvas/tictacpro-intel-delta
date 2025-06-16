import settingsData from '../mockData/settings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.data = { ...settingsData };
  }

  async getSettings() {
    await delay(100);
    return { ...this.data };
  }

  async updateSettings(newSettings) {
    await delay(150);
    this.data = { ...this.data, ...newSettings };
    return { ...this.data };
  }
}

export default new SettingsService();