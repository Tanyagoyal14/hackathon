import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SurveyPage from './pages/SurveyPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Survey check component
const SurveyCheck = ({ children }) => {
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Check if user has completed survey
    if (currentUser) {
      const surveyData = localStorage.getItem('surveyData');
      if (surveyData) {
        setHasCompletedSurvey(true);
      }
    }
  }, [currentUser]);

  if (!hasCompletedSurvey) {
    return <SurveyPage setHasCompletedSurvey={setHasCompletedSurvey} />;
  }

  return children;
};

// App component with providers
function AppWithProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GameProvider>
          <AppContent />
        </GameProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Main app content with routing
function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <SurveyPage setHasCompletedSurvey={() => { }} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SurveyCheck>
                <DashboardPage />
              </SurveyCheck>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppWithProviders;