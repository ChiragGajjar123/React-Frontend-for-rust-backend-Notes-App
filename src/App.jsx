import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { PageLoader } from './components/Spinner';

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// A wrapper for public (guest-only) routes
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  const isDarkMode = user?.theme === 'dark';

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>

      <Router>
        {/* Glow background blobs */}
        <div className="bg-glows">
          <div className="glow-1"></div>
          <div className="glow-2"></div>
        </div>

        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div className="auth-container">
                  <Login />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <div className="auth-container">
                  <Signup />
                </div>
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Wildcard redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

