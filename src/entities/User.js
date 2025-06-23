import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock user authentication fallback
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const User = {
  async login() {
    if (isSupabaseConfigured()) {
      try {
        // Use Supabase authentication with Google OAuth
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        })

        if (error) {
          console.error('Supabase login error:', error)
          throw error
        }

        return data
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    } else {
      // Fallback to mock authentication
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
    }
  },

  async logout() {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Supabase logout error:', error)
        }
        window.location.reload();
      } catch (error) {
        console.error('Logout failed:', error)
        // Fallback to clearing localStorage
        localStorage.removeItem('nwi_user');
        window.location.reload();
      }
    } else {
      // Mock logout
      await delay(300);
      localStorage.removeItem('nwi_user');
      window.location.reload();
    }
  },

  getCurrentUser() {
    if (isSupabaseConfigured()) {
      // Get current user from Supabase session
      const { data: { user } } = supabase.auth.getUser()
      return user
    } else {
      // Fallback to localStorage
      const userStr = localStorage.getItem('nwi_user');
      return userStr ? JSON.parse(userStr) : null;
    }
  },

  isAuthenticated() {
    if (isSupabaseConfigured()) {
      const { data: { session } } = supabase.auth.getSession()
      return !!session
    } else {
      return this.getCurrentUser() !== null;
    }
  },

  async me() {
    if (isSupabaseConfigured()) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        if (!user) throw new Error('User not authenticated')
        return user
      } catch (error) {
        console.error('Failed to get user:', error)
        throw new Error('User not authenticated')
      }
    } else {
      // Mock implementation
      await delay(500); // Simulate API call
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      return user;
    }
  },

  async updateMyUserData(updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: updates
        })
        if (error) throw error
        return data.user
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      }
    } else {
      // Mock implementation
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
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    if (isSupabaseConfigured()) {
      return supabase.auth.onAuthStateChange(callback)
    } else {
      // Mock implementation - call callback immediately with current state
      const user = this.getCurrentUser()
      callback('SIGNED_IN', user ? { user } : null)
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
  }
};
