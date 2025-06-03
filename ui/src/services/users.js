// src/services/users.js
import { rowsApi } from './rowsApi';

/**
 * Get a creator's profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Creator profile
 */
export const getCreatorProfile = async (userId) => {
  try {
    
    // First check if user exists and is a creator
    const user = await rowsApi.getById('users', userId);
    
    if (!user || user.userType !== 'creator') {
      throw new Error('Creator not found');
    }
    
    // Get the creator profile
    const profiles = await rowsApi.query('creator_profiles', { userId });
    
    if (!profiles || profiles.length === 0) {
      throw new Error('Creator profile not found');
    }
    
    // Return the profile with user data
    const profile = profiles[0];
    return {
      ...profile,
      email: user.email,
      userType: user.userType
    };
  } catch (error) {
    console.error('Get creator profile error:', error);
    throw new Error(error.message || 'Error fetching creator profile');
  }
};

/**
 * Get a creator's profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Creator profile
 */
export const getUserProfile = async (user) => {
  return {
    displayName: user.firstname,
    email: user.email,
    userType: user.userType
  };
}

/**
 * Get a brand's profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Brand profile
 */
export const getBrandProfile = async (userId) => {
  try {
    // First check if user exists and is a brand
    const user = await rowsApi.getById('users', userId);
    
    if (!user || user.userType !== 'brand') {
      throw new Error('Brand not found');
    }
    
    // Get the brand profile
    const profiles = await rowsApi.query('brand_profiles', { userId });
    
    if (!profiles || profiles.length === 0) {
      throw new Error('Brand profile not found');
    }
    
    // Return the profile with user data
    const profile = profiles[0];
    return {
      ...profile,
      email: user.email,
      userType: user.userType
    };
  } catch (error) {
    console.error('Get brand profile error:', error);
    throw new Error(error.message || 'Error fetching brand profile');
  }
};

/**
 * Update a user's profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    // First get the user to determine profile type
    const user = await rowsApi.getById('users', userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    let profile;
    
    if (user.userType === 'creator') {
      // Get the creator profile ID
      const profiles = await rowsApi.query('creator_profiles', { userId });
      
      if (!profiles || profiles.length === 0) {
        throw new Error('Creator profile not found');
      }
      
      const profileId = profiles[0].id;
      
      // Update the profile
      profile = await rowsApi.update('creator_profiles', profileId, {
        ...profileData,
        updatedAt: new Date()
      });
      
    } else if (user.userType === 'brand') {
      // Get the brand profile ID
      const profiles = await rowsApi.query('brand_profiles', { userId });
      
      if (!profiles || profiles.length === 0) {
        throw new Error('Brand profile not found');
      }
      
      const profileId = profiles[0].id;
      
      // Update the profile
      profile = await rowsApi.update('brand_profiles', profileId, {
        ...profileData,
        updatedAt: new Date()
      });
    } else {
      throw new Error('Invalid user type');
    }
    
    // Return the updated profile with user data
    return {
      ...profile,
      email: user.email,
      userType: user.userType
    };
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.message || 'Error updating profile');
  }
};

/**
 * Get all creator profiles
 * @param {Object} query - Optional query parameters
 * @returns {Promise<Array>} - Array of creator profiles
 */
export const getAllCreatorProfiles = async (query = {}) => {
  try {
    const { page = 1, pageSize = 10, ...filters } = query;
    
    const creators = await rowsApi.query('creator_profiles', filters, {
      page,
      pageSize,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    
    // For each creator, get the user email
    const creatorsWithEmail = await Promise.all(creators.map(async (creator) => {
      try {
        const user = await rowsApi.getById('users', creator.userId);
        return {
          ...creator,
          email: user.email
        };
      } catch (error) {
        // If user not found, just return the creator without email
        return creator;
      }
    }));
    
    return creatorsWithEmail;
  } catch (error) {
    console.error('Get all creators error:', error);
    throw new Error(error.message || 'Error fetching creators');
  }
};

/**
 * Get all brand profiles
 * @param {Object} query - Optional query parameters
 * @returns {Promise<Array>} - Array of brand profiles
 */
export const getAllBrandProfiles = async (query = {}) => {
  try {
    const { page = 1, pageSize = 10, ...filters } = query;
    
    const brands = await rowsApi.query('brand_profiles', filters, {
      page,
      pageSize,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    
    // For each brand, get the user email
    const brandsWithEmail = await Promise.all(brands.map(async (brand) => {
      try {
        const user = await rowsApi.getById('users', brand.userId);
        return {
          ...brand,
          email: user.email
        };
      } catch (error) {
        // If user not found, just return the brand without email
        return brand;
      }
    }));
    
    return brandsWithEmail;
  } catch (error) {
    console.error('Get all brands error:', error);
    throw new Error(error.message || 'Error fetching brands');
  }
};

/**
 * Search users (creators or brands) by criteria
 * @param {Object} criteria - Search criteria
 * @param {string} userType - Type of users to search ('creator' or 'brand')
 * @returns {Promise<Array>} - Array of matching users
 */
export const searchUsers = async (criteria = {}, userType = 'creator') => {
  try {
    // Build the search filters
    const filters = {};
    
    // Determine which table to search based on user type
    let tableName;
    
    if (userType === 'creator') {
      tableName = 'creator_profiles';
      
      // Handle creator-specific search criteria
      if (criteria.categories && criteria.categories.length > 0) {
        filters.categories = { contains: criteria.categories };
      }
      
      if (criteria.minFollowers) {
        filters.followerCount_gte = criteria.minFollowers;
      }
      
      if (criteria.maxFollowers) {
        filters.followerCount_lte = criteria.maxFollowers;
      }
      
      if (criteria.minEngagement) {
        filters.engagementRate_gte = criteria.minEngagement;
      }
      
    } else if (userType === 'brand') {
      tableName = 'brand_profiles';
      
      // Handle brand-specific search criteria
      if (criteria.industry) {
        filters.industry = criteria.industry;
      }
      
      if (criteria.companySize) {
        filters.companySize = criteria.companySize;
      }
    } else {
      throw new Error('Invalid user type specified');
    }
    
    // Common search criteria
    if (criteria.searchTerm) {
      if (userType === 'creator') {
        filters.displayName_contains = criteria.searchTerm;
      } else {
        filters.companyName_contains = criteria.searchTerm;
      }
    }
    
    // Execute the search query
    const { page = 1, pageSize = 10 } = criteria;
    const results = await rowsApi.query(tableName, filters, {
      page,
      pageSize,
      orderBy: criteria.orderBy || 'created_at',
      orderDirection: criteria.orderDirection || 'desc'
    });
    
    // For each result, fetch the user email
    const resultsWithEmail = await Promise.all(results.map(async (item) => {
      try {
        const user = await rowsApi.getById('users', item.userId);
        return {
          ...item,
          email: user.email
        };
      } catch (error) {
        // If user not found, just return the item without email
        return item;
      }
    }));
    
    return resultsWithEmail;
  } catch (error) {
    console.error(`Search ${userType}s error:`, error);
    throw new Error(error.message || `Error searching ${userType}s`);
  }
};

/**
 * Get user statistics (campaign count, application count, etc.)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User statistics
 */
export const getUserStats = async (userId) => {
  try {
    // Get the user
    const user = await rowsApi.getById('users', userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize stats object
    const stats = {
      userId,
      userType: user.userType
    };
    
    // Get different stats based on user type
    if (user.userType === 'creator') {
      // Count applications by this creator
      const applications = await rowsApi.query('applications', { creatorUserId: userId });
      stats.totalApplications = applications.length;
      
      // Count approved applications
      stats.approvedApplications = applications.filter(app => app.status === 'approved').length;
      
      // Count completed applications
      stats.completedApplications = applications.filter(app => app.status === 'completed').length;
      
    } else if (user.userType === 'brand') {
      // Count campaigns by this brand
      const campaigns = await rowsApi.query('campaigns', { brandUserId: userId });
      stats.totalCampaigns = campaigns.length;
      
      // Count active campaigns
      stats.activeCampaigns = campaigns.filter(camp => camp.status === 'active').length;
      
      // Count applications to all campaigns
      let totalApplications = 0;
      for (const campaign of campaigns) {
        const applications = await rowsApi.query('applications', { campaignId: campaign.id });
        totalApplications += applications.length;
      }
      stats.totalApplicationsReceived = totalApplications;
    }
    
    return stats;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw new Error(error.message || 'Error fetching user statistics');
  }
};

export default {
  getCreatorProfile,
  getBrandProfile,
  updateUserProfile,
  getAllCreatorProfiles,
  getAllBrandProfiles,
  searchUsers,
  getUserStats
};