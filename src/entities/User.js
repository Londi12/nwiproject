// Mock user authentication
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const User = {
  async login() {
    await delay(1000); // Simulate login delay

    // Mock successful login
    const user = {
      id: 1,
      name: 'John Associate',
      full_name: 'John Associate',
      email: 'john@nwivisas.com',
      role: 'associate',
      created_at: '2024-01-01',
      last_login: new Date().toISOString()
    };

    // Store user in localStorage for persistence
    localStorage.setItem('nwi_user', JSON.stringify(user));

    // Trigger a page reload or navigation to dashboard
    window.location.reload();

    return user;
  },

  async logout() {
    await delay(300);
    localStorage.removeItem('nwi_user');
    window.location.reload();
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('nwi_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  async me() {
    await delay(500); // Simulate API call
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  },

  async updateMyUserData(updates) {
    await delay(800); // Simulate API call
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Update user data
    const updatedUser = {
      ...currentUser,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update localStorage
    localStorage.setItem('nwi_user', JSON.stringify(updatedUser));

    return updatedUser;
  }
};
