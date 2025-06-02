import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create the Auth context
export const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // State for user and loading status
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if there's a token in local storage on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Validate the token with the API
          const user = await api.auth.validateToken(token);
          
          if (user) {
            setCurrentUser(user);
            
            // Fetch the appropriate profile based on user type
            if (user.userType === 'creator') {
              const profile = await api.users.getCreatorProfile(user.id);
              setUserProfile(profile);
            } else if (user.userType === 'brand') {
              const profile = await api.users.getBrandProfile(user.id);
              setUserProfile(profile);
            }
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem('auth_token');
        setError("Authentication failed. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.login(email, password);
      
      // Store the token in local storage
      localStorage.setItem('auth_token', response.token);
      
      // Set the user in state
      setCurrentUser(response.user);
      
      // Fetch the user's profile based on their type
      if (response.user.userType === 'creator') {
        const profile = await api.users.getCreatorProfile(response.user.id);
        setUserProfile(profile);
      } else if (response.user.userType === 'brand') {
        const profile = await api.users.getBrandProfile(response.user.id);
        setUserProfile(profile);
      }
      
      return response.user;
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.register(userData);
      
      // Store the token in local storage
      localStorage.setItem('auth_token', response.token);
      
      // Set the user in state
      setCurrentUser(response.user);
      
      // Set the initial profile
      if (response.user.userType === 'creator') {
        const profile = await api.users.getCreatorProfile(response.user.id);
        setUserProfile(profile);
      } else if (response.user.userType === 'brand') {
        const profile = await api.users.getBrandProfile(response.user.id);
        setUserProfile(profile);
      }
      
      return response.user;
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!currentUser) {
      throw new Error("No authenticated user");
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await api.users.updateProfile(currentUser.id, profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      setError(error.message || "Failed to update profile. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update auth token (useful after password change, etc.)
  const updateToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  };

  // Get current auth token
  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  // Value object to provide through the context
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updateToken,
    getToken,
    isAuthenticated: !!currentUser,
    isCreator: currentUser?.userType === 'creator',
    isBrand: currentUser?.userType === 'brand',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;