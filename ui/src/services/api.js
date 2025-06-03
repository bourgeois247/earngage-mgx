// src/services/api.js
import * as auth from './auth';
import * as users from './users';
import * as campaigns from './campaigns';
import * as applications from './applications';
import * as analytics from './analytics';
import { rowsApi } from './rowsApi';

/**
 * Centralized API service that provides access to all Rows.com-specific services
 */
const api = {
  /**
   * Authentication services
   */
  auth: {
    /**
     * Login a user with email and password
     * @param {string} email - User email
     * @param {string} password - User password 
     * @returns {Promise<Object>} - User data and token
     */
    login: auth.loginUser,
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - Created user data and token
     */
    register: auth.registerUser,
    
    /**
     * Validate a JWT token and return user information
     * @param {string} token - JWT token
     * @returns {Promise<Object|null>} - User object if valid, null otherwise
     */
    validateToken: auth.validateToken
  },
  
  /**
   * User profile services
   */
  users: {
    /**
     * Get a creator's profile
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Creator profile
     */
    getCreatorProfile: users.getCreatorProfile,
    
    /**
     * Get a user's profile
     * @param {Object} user - User object
     * @returns {Object} - User profile
     */
    getUserProfile: users.getUserProfile,
    
    /**
     * Get a brand's profile
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Brand profile
     */
    getBrandProfile: users.getBrandProfile,
    
    /**
     * Update a user's profile
     * @param {string} userId - User ID
     * @param {Object} profileData - Updated profile data
     * @returns {Promise<Object>} - Updated profile
     */
    updateProfile: users.updateUserProfile,
    
    /**
     * Get all creator profiles
     * @param {Object} [query] - Optional query parameters
     * @returns {Promise<Array>} - Array of creator profiles
     */
    getAllCreators: users.getAllCreatorProfiles,
    
    /**
     * Get all brand profiles
     * @param {Object} [query] - Optional query parameters
     * @returns {Promise<Array>} - Array of brand profiles
     */
    getAllBrands: users.getAllBrandProfiles
  },
  
  /**
   * Campaign services
   */
  campaigns: {
    /**
     * Create a new campaign
     * @param {Object} campaignData - Campaign data
     * @returns {Promise<Object>} - Created campaign
     */
    create: campaigns.createCampaign,
    
    /**
     * Get a specific campaign by ID
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<Object>} - Campaign data
     */
    getById: campaigns.getCampaignById,
    
    /**
     * Update a campaign
     * @param {string} campaignId - Campaign ID
     * @param {Object} campaignData - Updated campaign data
     * @returns {Promise<Object>} - Updated campaign
     */
    update: campaigns.updateCampaign,
    
    /**
     * Delete a campaign
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<boolean>} - Success status
     */
    delete: campaigns.deleteCampaign,
    
    /**
     * Get all campaigns
     * @param {Object} [query] - Optional query parameters
     * @returns {Promise<Array>} - Array of campaigns
     */
    getAll: campaigns.getAllCampaigns,
    
    /**
     * Get campaigns by brand user ID
     * @param {string} brandUserId - Brand user ID
     * @returns {Promise<Array>} - Array of campaigns
     */
    getByBrandId: campaigns.getCampaignsByBrandUserId,
    
    /**
     * Get active campaigns
     * @returns {Promise<Array>} - Array of active campaigns
     */
    getActive: campaigns.getActiveCampaigns,
    
    /**
     * Search campaigns by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Array>} - Array of matching campaigns
     */
    search: campaigns.searchCampaigns,
    
    /**
     * Change campaign status
     * @param {string} campaignId - Campaign ID
     * @param {string} status - New status
     * @returns {Promise<Object>} - Updated campaign
     */
    changeStatus: campaigns.changeCampaignStatus
  },
  
  /**
   * Application services
   */
  applications: {
    /**
     * Create a new application
     * @param {Object} applicationData - Application data
     * @returns {Promise<Object>} - Created application
     */
    create: applications.createApplication,
    
    /**
     * Get a specific application by ID
     * @param {string} applicationId - Application ID
     * @returns {Promise<Object>} - Application data
     */
    getById: applications.getApplicationById,
    
    /**
     * Update an application
     * @param {string} applicationId - Application ID
     * @param {Object} applicationData - Updated application data
     * @returns {Promise<Object>} - Updated application
     */
    update: applications.updateApplication,
    
    /**
     * Delete an application
     * @param {string} applicationId - Application ID
     * @returns {Promise<boolean>} - Success status
     */
    delete: applications.deleteApplication,
    
    /**
     * Get all applications for a specific campaign
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<Array>} - Array of applications
     */
    getByCampaignId: applications.getApplicationsByCampaignId,
    
    /**
     * Get all applications submitted by a creator
     * @param {string} creatorUserId - Creator user ID
     * @returns {Promise<Array>} - Array of applications
     */
    getByCreatorId: applications.getApplicationsByCreatorId,
    
    /**
     * Change application status
     * @param {string} applicationId - Application ID
     * @param {string} status - New status
     * @param {string} [feedback] - Optional feedback
     * @returns {Promise<Object>} - Updated application
     */
    changeStatus: applications.changeApplicationStatus,
    
    /**
     * Get all applications with a specific status
     * @param {string} status - Application status
     * @returns {Promise<Array>} - Array of applications
     */
    getByStatus: applications.getApplicationsByStatus,
    
    /**
     * Check if a creator has already applied to a campaign
     * @param {string} creatorUserId - Creator user ID
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<boolean>} - True if already applied
     */
    hasCreatorApplied: applications.hasCreatorAppliedToCampaign
  },
  
  /**
   * Analytics services
   */
  analytics: {
    /**
     * Record an analytics event
     * @param {Object} eventData - Event data
     * @returns {Promise<Object>} - Created event
     */
    recordEvent: analytics.recordAnalyticsEvent,
    
    /**
     * Track campaign view
     * @param {string} campaignId - Campaign ID
     * @param {string} [viewerId] - Viewer user ID
     * @returns {Promise<Object>} - Created event
     */
    trackCampaignView: analytics.trackCampaignView,
    
    /**
     * Track campaign application
     * @param {string} campaignId - Campaign ID
     * @param {string} creatorId - Creator user ID
     * @returns {Promise<Object>} - Created event
     */
    trackCampaignApplication: analytics.trackCampaignApplication,
    
    /**
     * Track profile view
     * @param {string} profileId - Profile ID
     * @param {string} profileType - Profile type
     * @param {string} [viewerId] - Viewer user ID
     * @returns {Promise<Object>} - Created event
     */
    trackProfileView: analytics.trackProfileView,
    
    /**
     * Get campaign view analytics
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<Object>} - View statistics
     */
    getCampaignViews: analytics.getCampaignViewAnalytics,
    
    /**
     * Get campaign application analytics
     * @param {string} campaignId - Campaign ID
     * @returns {Promise<Object>} - Application statistics
     */
    getCampaignApplications: analytics.getCampaignApplicationAnalytics,
    
    /**
     * Get creator analytics
     * @param {string} creatorId - Creator user ID
     * @returns {Promise<Object>} - Creator statistics
     */
    getCreatorStats: analytics.getCreatorAnalytics,
    
    /**
     * Get brand analytics
     * @param {string} brandId - Brand user ID
     * @returns {Promise<Object>} - Brand statistics
     */
    getBrandStats: analytics.getBrandAnalytics,
    
    /**
     * Get platform-wide analytics
     * @returns {Promise<Object>} - Platform statistics
     */
    getPlatformStats: analytics.getPlatformAnalytics,
    
    /**
     * Get analytics by date range
     * @param {string} startDate - Start date
     * @param {string} endDate - End date
     * @param {string} [eventType] - Optional event type
     * @returns {Promise<Array>} - Analytics events
     */
    getByDateRange: analytics.getAnalyticsByDateRange
  },
  
  /**
   * Raw Rows API access (for advanced use cases)
   */
  rows: rowsApi
};

export default api;