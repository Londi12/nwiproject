import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Mock user authentication fallback
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const User = {
  async login(email = null, password = null) {
    console.log('Login attempt - Supabase configured:', isSupabaseConfigured());

    // In development mode, always use mock authentication for easier testing
    if (import.meta.env.DEV) {
      console.log('Development mode - using mock authentication...');
      return this.mockLogin();
    }

    if (isSupabaseConfigured()) {
      try {
        if (email && password) {
          // Email/password login
          console.log('Attempting Supabase email/password login...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

          if (error) {
            console.error('Supabase email login error:', error);
            throw error; // Don't fall back for email login errors
          }

          return data;
        } else {
          // Try Google OAuth (if enabled)
          console.log('Attempting Supabase OAuth login...');
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              }
            }
          });

          if (error) {
            console.error('Supabase OAuth error:', error);
            // Fall back to mock login for OAuth errors
            console.log('OAuth not configured, falling back to mock authentication...');
            return this.mockLogin();
          }

          return data;
        }
      } catch (error) {
        console.error('Supabase login failed:', error);
        if (email && password) {
          throw error; // Re-throw email login errors
        } else {
          return this.mockLogin(); // Fall back for OAuth errors
        }
      }
    } else {
      console.log('Using mock authentication...');
      return this.mockLogin();
    }
  },

  async signUp(email, password, fullName = '') {
    console.log('Sign up attempt - Supabase configured:', isSupabaseConfigured());

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          console.error('Supabase signup error:', error);
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Supabase signup failed:', error);
        throw error;
      }
    } else {
      // Mock signup
      console.log('Using mock signup...');
      await delay(1000);

      const user = {
        id: Date.now(),
        email: email,
        full_name: fullName,
        role: 'associate',
        created_at: new Date().toISOString()
      };

      localStorage.setItem('visa_flow_user', JSON.stringify(user));
      return { user };
    }
  },

  async mockLogin(role = 'associate') {
    // Fallback to mock authentication
    await delay(1000); // Simulate login delay

    // Create different mock users based on role
    const users = {
      associate: {
        id: 1,
        name: 'John Associate',
        full_name: 'John Associate',
        email: 'john@visaflow.com',
        role: 'associate',
        created_at: '2024-01-01',
        last_login: new Date().toISOString()
      },
      admin: {
        id: 2,
        name: 'Admin User',
        full_name: 'Admin User',
        email: 'admin@visaflow.com',
        role: 'admin',
        created_at: '2024-01-01',
        last_login: new Date().toISOString()
      }
    };

    const user = users[role] || users.associate;

    // Store user in localStorage for persistence
    localStorage.setItem('visa_flow_user', JSON.stringify(user));

    console.log('Mock login successful:', user);

    // Trigger auth state change callback if it exists
    if (this._authCallback) {
      console.log('🔄 Triggering auth state change: SIGNED_IN');
      // Use setTimeout to ensure the callback is called after the current execution
      setTimeout(() => {
        this._authCallback('SIGNED_IN', { user });
      }, 0);
    } else {
      console.log('⚠️ No auth callback registered - checking global callback');
      // Check if there's a global callback stored
      if (window._visaFlowAuthCallback) {
        console.log('🔄 Using global auth callback');
        setTimeout(() => {
          window._visaFlowAuthCallback('SIGNED_IN', { user });
        }, 0);
      }
    }

    // Return user data without reloading the page
    return { user };
  },

  // Development helper method to switch user roles
  async switchToAdmin() {
    if (import.meta.env.DEV) {
      console.log('Switching to admin user...');
      return this.mockLogin('admin');
    }
  },

  async switchToAssociate() {
    if (import.meta.env.DEV) {
      console.log('Switching to associate user...');
      return this.mockLogin('associate');
    }
  },

  async logout() {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error('Supabase logout error:', error)
        }
        // Don't reload the page, let the app handle the state change
      } catch (error) {
        console.error('Logout failed:', error)
        // Fallback to clearing localStorage
        localStorage.removeItem('visa_flow_user');
      }
    } else {
      // Mock logout
      await delay(300);
      localStorage.removeItem('visa_flow_user');

      // Trigger auth state change callback if it exists
      if (this._authCallback) {
        console.log('🔄 Triggering auth state change: SIGNED_OUT');
        this._authCallback('SIGNED_OUT', null);
      }
    }
  },

  getCurrentUser() {
    // In development mode, always use localStorage
    if (import.meta.env.DEV) {
      const userStr = localStorage.getItem('visa_flow_user');
      return userStr ? JSON.parse(userStr) : null;
    }

    if (isSupabaseConfigured()) {
      try {
        // Get current user from Supabase session (synchronous)
        const { data: { session } } = supabase.auth.getSession()
        return session?.user || null;
      } catch (error) {
        console.log('Error getting Supabase session:', error);
        // Fallback to localStorage
        const userStr = localStorage.getItem('visa_flow_user');
        return userStr ? JSON.parse(userStr) : null;
      }
    } else {
      // Fallback to localStorage
      const userStr = localStorage.getItem('visa_flow_user');
      return userStr ? JSON.parse(userStr) : null;
    }
  },

  isAuthenticated() {
    // In development mode, always check localStorage
    if (import.meta.env.DEV) {
      return this.getCurrentUser() !== null;
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = supabase.auth.getSession()
        return !!session
      } catch (error) {
        console.log('Error checking Supabase session:', error);
        return this.getCurrentUser() !== null;
      }
    } else {
      return this.getCurrentUser() !== null;
    }
  },

  async me() {
    // In development mode, always use localStorage
    if (import.meta.env.DEV) {
      await delay(500); // Simulate API call
      const user = this.getCurrentUser();
      return user; // Return null if no user, don't throw error
    }

    if (isSupabaseConfigured()) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user // Return null if no user, don't throw error
      } catch (error) {
        console.log('Supabase auth session missing - using mock data mode:', error.message)
        return null // Return null instead of throwing error
      }
    } else {
      // Mock implementation
      await delay(500); // Simulate API call
      const user = this.getCurrentUser();
      return user; // Return null if no user, don't throw error
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
      localStorage.setItem('visa_flow_user', JSON.stringify(updatedUser));

      return updatedUser;
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    if (isSupabaseConfigured()) {
      return supabase.auth.onAuthStateChange(callback)
    } else {
      // Store callback for mock implementation (both locally and globally)
      this._authCallback = callback;
      window._visaFlowAuthCallback = callback;
      console.log('📡 Auth state change listener registered (local + global)');

      // Mock implementation - call callback immediately with current state
      const user = this.getCurrentUser()
      const event = user ? 'SIGNED_IN' : 'INITIAL_SESSION';
      console.log(`📡 Initial auth state: ${event}`, user ? { user } : null);
      callback(event, user ? { user } : null)

      return { data: { subscription: { unsubscribe: () => {
        console.log('📡 Auth state change listener unsubscribed');
        this._authCallback = null;
        window._visaFlowAuthCallback = null;
      } } } }
    }
  }
};
