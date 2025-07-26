import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user', error);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const signup = async (email, password, name) => {
    // In a real app, this would be an API call to create a new user
    // For now, we'll simulate it
    try {
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup error', error);
      return { success: false, error: error.message || 'Failed to create account' };
    }
  };

  const login = async (email, password) => {
    // In a real app, this would be an API call to authenticate
    // For now, we'll simulate it with localStorage
    try {
      // Simulate user validation
      if (email === 'demo@example.com' && password === 'password') {
        const user = {
          id: '12345',
          email,
          name: 'Demo User',
          createdAt: new Date().toISOString()
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        return { success: true, user };
      } else {
        // Check if user exists in our simulated database
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const matchedUser = users.find(u => u.email === email);

          if (matchedUser) {
            // In a real app, we would verify the password hash
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            setCurrentUser(matchedUser);
            return { success: true, user: matchedUser };
          }
        }

        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error', error);
      return { success: false, error: error.message || 'Failed to log in' };
    }
  };

  const logout = async () => {
    try {
      // Clear all auth-related data from localStorage
      localStorage.removeItem('currentUser');
      
      // Also clear survey data to force re-taking the survey on next login
      // This ensures a clean state when logging out
      localStorage.removeItem('surveyData');
      
      // Reset the current user state
      setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error', error);
      return { success: false, error: error.message || 'Failed to log out' };
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export as a named function declaration for better HMR compatibility
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}