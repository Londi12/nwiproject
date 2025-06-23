import React, { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Welcome from './pages/Welcome'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import { User } from './entities/User'
import { Button } from './components/ui/button'
import { LogOut, UserCircle, Shield } from 'lucide-react'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(import.meta.env.DEV); // Show in development by default
  const [adminKeySequence, setAdminKeySequence] = useState('');

  useEffect(() => {
    // Check if user is authenticated on app load and listen to auth changes
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen to auth state changes
    const { data: { subscription } } = User.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
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
    await User.logout();
    setUser(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'leads':
        return <Leads />;
      case 'welcome':
        return <Welcome />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return <AdminDashboard />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
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

  // Show Welcome page if not authenticated
  if (!user) {
    return <Welcome />;
  }

  // Show main application if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer select-none"
              onDoubleClick={() => import.meta.env.DEV && setShowAdminPanel(true)}
              title={import.meta.env.DEV ? "Double-click to toggle admin panel" : "NWI Portal"}
            >
              NWI Portal
              {import.meta.env.DEV && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  DEV
                </span>
              )}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('leads')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'leads'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Leads
                </button>
                <button
                  onClick={() => setCurrentPage('welcome')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'welcome'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Welcome (Demo)
                </button>
                {showAdminPanel && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'text-red-600 hover:text-red-900 hover:bg-red-100'
                    }`}
                    title="Secret Admin Panel"
                  >
                    <Shield className="w-4 h-4 inline mr-1" />
                    Admin
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage('profile')}
                  className={currentPage === 'profile' ? 'bg-blue-100 text-blue-700' : ''}
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
