// src/services/auth.js
import { rowsApi } from './rowsApi';
import { createUser } from '../../../earngage_api_service';

// Instead of handling JWT ourselves, we'll rely on the backend for token generation and validation

/**
 * Login a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data and token
 */
export const loginUser = async (email, password) => {
  try {
    // Normalize email address
    const normalizedEmail = email.toLowerCase().trim();
    
    // In a real implementation, this would be a call to a backend authentication endpoint
    // For now, we'll simulate by calling the Rows API directly
    // WARNING: This is NOT secure for production use - passwords should NEVER be compared on client-side!
    
    // Find the user in the database
    const userResponse = await rowsApi.query('users', { email: normalizedEmail });
    
    if (!userResponse || userResponse.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = userResponse[0];
    
    // In a real implementation, password validation would be done on the server
    // For demo purposes only - INSECURE!
    // This code should be replaced with a proper backend authentication call
    const mockValidPassword = password === 'demo123'; // Replace with actual server-side validation
    
    if (!mockValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Generate a simple mock token (in real app, this would come from the backend)
    // This is just for demonstration - NOT a real JWT
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Return user data (excluding password) and token
    const { password: _, ...userData } = user;
    
    return {
      user: userData,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Error logging in. Please try again.');
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Created user data and token
 */
export const registerUser = async (userData) => {
  try {
    const { email, password, userType, firstname, surname } = userData;
    
    // Normalize email address
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user with this email already exists
    // const existingUsers = await rowsApi.query('users', { email: normalizedEmail });
    
    // if (existingUsers && existingUsers.length > 0) {
    //   throw new Error('User with this email already exists');
    // }
    
    // In a real implementation, this would send data to a secure backend endpoint
    // that would handle password hashing and user creation
    
    // Create user in the database - this is just for demo purposes
    // In production, the password would be hashed on the server-side
    const mockHashedPassword = `${password}_hashed`; // Simulate hashing (NEVER do this in production!)
    
    // const newUser = await rowsApi.create('users', {
    //   email: normalizedEmail,
    //   password: mockHashedPassword, // This would normally be properly hashed on the server
    //   userType: userType || 'creator', // Default to creator if not specified
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // });

    const newUser = await createUser({
      firstname,
      surname,
      email: normalizedEmail,
      password: mockHashedPassword,
      role: userType,
    });
    console.log(newUser);

    // Generate a mock token (in a real app, this would come from the backend)
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Return user data (excluding password) and token
    const { password: _, ...userData2 } = newUser;
    
    return {
      user: userData2,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Error creating account. Please try again.');
  }
};

/**
 * Validate a token
 * @param {string} token - Auth token
 * @returns {Promise<Object|null>} - User object if valid, null otherwise
 */
export const validateToken = async (token) => {
  try {
    // In a real implementation, this would validate the token with a backend endpoint
    // For now, we'll simulate by checking if the token starts with our mock prefix
    // and extracting a user ID from it
    const userLocalStorage = localStorage.getItem('user');
    if (userLocalStorage) {
      return JSON.parse(userLocalStorage);
    }
    
    if (!token || !token.startsWith('mock_token_')) {
      return null;
    }
    
    // In a real app, we would decode the JWT here to get the user ID
    // For our mock implementation, we'll get a user from the database for demo purposes
    const users = await rowsApi.getAll('users', { limit: 1 });
    const user = users && users.length > 0 ? users[0] : null;
    
    if (!user) {
      return null;
    }
    
    // Return user data excluding password
    const { password, ...userData } = user;
    return userData;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - Success status
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Get the user
    const user = await rowsApi.getById('users', userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, password validation would be done on the server
    // This is just for demonstration - NOT secure!
    const mockValidPassword = currentPassword === 'demo123';
    
    if (!mockValidPassword) {
      throw new Error('Current password is incorrect');
    }
    
    // In production, password hashing would be done on the server
    const mockHashedPassword = `${newPassword}_hashed`;
    
    // Update user's password
    await rowsApi.update('users', userId, {
      password: mockHashedPassword,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Password change error:', error);
    throw new Error(error.message || 'Error changing password. Please try again.');
  }
};