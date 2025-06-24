import React, { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Welcome from './pages/Welcome'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import KnowledgeBase from './pages/KnowledgeBase'
import { User } from './entities/User'
import { Button } from './components/ui/button'
import { LogOut, UserCircle, Shield } from 'lucide-react'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(import.meta.env.DEV); // Show in development by default
  const [adminKeySequence, setAdminKeySequence] = useState('');

  // Debug navigation
  const handleNavigation = (page) => {
    console.log('🧭 Navigating to:', page);
    setCurrentPage(page);

    // If navigating to dashboard, check if we have a user in localStorage
    if (page === 'dashboard' && !user) {
      const currentUser = User.getCurrentUser();
      if (currentUser) {
        console.log('🔍 Found user in localStorage, setting user state:', currentUser);
        setUser(currentUser);
      }
    }
  };

  useEffect(() => {
    // Check if user is authenticated on app load and listen to auth changes
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        console.log('Initial user check:', currentUser);
        setUser(currentUser);

        // If user is found, navigate to dashboard
        if (currentUser) {
          setCurrentPage('dashboard');
        }
      } catch (error) {
        console.log('User check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen to auth state changes
    const { data: { subscription } } = User.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change received:', event, session);

      if (event === 'SIGNED_IN') {
        // Handle both Supabase format and mock format
        const userData = session?.user || session;
        console.log('✅ User signed in:', userData);
        setUser(userData);
        setLoading(false);

        // Navigate to dashboard after successful login
        if (userData) {
          console.log('🏠 Navigating to dashboard...');
          setCurrentPage('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setUser(null);
        setLoading(false);
        setCurrentPage('welcome');
      } else if (event === 'INITIAL_SESSION') {
        console.log('🔍 Initial session check:', session);
        if (session?.user) {
          setUser(session.user);
          setCurrentPage('dashboard');
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Admin panel activation logic
    const handleKeyPress = (e) => {
      // In production, require secret code. In development, admin panel is always available
      if (import.meta.env.PROD) {
        // Ignore if typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }

        const newSequence = adminKeySequence + e.key.toLowerCase();
        setAdminKeySequence(newSequence);

        // Secret code: "admin123"
        if (newSequence.includes('admin123')) {
          setShowAdminPanel(true);
          setAdminKeySequence('');
          console.log('Admin panel activated!');
        }

        // Reset sequence if it gets too long
        if (newSequence.length > 15) {
          setAdminKeySequence('');
        }
      }
    };

    // Only add event listener in production
    if (import.meta.env.PROD) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [adminKeySequence]);

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      setCurrentPage('welcome');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setCurrentPage('welcome');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigation} />;
      case 'knowledge-base':
        return <KnowledgeBase onNavigate={handleNavigation} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Welcome page if not authenticated (unless accessing admin in dev mode)
  if (!user && !(import.meta.env.DEV && currentPage === 'admin')) {
    return <Welcome onNavigate={handleNavigation} />;
  }

  // Show main application if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-lg sm:text-2xl font-bold text-gray-900 cursor-pointer select-none"
              onDoubleClick={() => import.meta.env.DEV && setShowAdminPanel(true)}
              title={import.meta.env.DEV ? "Double-click to toggle admin panel" : "Visa Flow"}
            >
              Visa Flow
              {import.meta.env.DEV && (
                <span className="ml-1 sm:ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 sm:px-2 py-1 rounded hidden sm:inline">
                  DEV {showAdminPanel ? '(Admin Visible)' : '(Admin Hidden)'}
                  {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && ' - Mock Data'}
                </span>
              )}
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex space-x-1 sm:space-x-4">
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">📊</span>
                </button>

                <button
                  onClick={() => handleNavigation('knowledge-base')}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === 'knowledge-base'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">Knowledge Base</span>
                  <span className="sm:hidden">📚</span>
                </button>
                <button
                  onClick={() => handleNavigation('welcome')}
                  className={`px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === 'welcome'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">Welcome (Demo)</span>
                  <span className="sm:hidden">🏠</span>
                </button>
                {showAdminPanel && (
                  <button
                    onClick={() => handleNavigation('admin')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-slate-100 text-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Secret Admin Panel"
                  >
                    <Shield className="w-4 h-4 inline mr-1" />
                    Admin
                  </button>
                )}
                {import.meta.env.DEV && !showAdminPanel && (
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className="px-3 py-1 rounded text-xs bg-orange-100 text-orange-700 hover:bg-orange-200"
                    title="Force show admin panel (DEV only)"
                  >
                    Show Admin
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-3 border-l border-gray-200 pl-2 sm:pl-4">
                <span className="text-xs sm:text-sm text-gray-600 hidden md:block">
                  Welcome, {user ? user.name : 'Developer (Not Logged In)'}
                </span>
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigation('profile')}
                    className={`${currentPage === 'profile' ? 'bg-blue-100 text-blue-700' : ''} px-2 sm:px-3`}
                  >
                    <UserCircle className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={user ? handleLogout : () => handleNavigation('welcome')}
                  className="px-2 sm:px-3"
                >
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{user ? 'Logout' : 'Back to Welcome'}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-3 sm:p-6">
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
