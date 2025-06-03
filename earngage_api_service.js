/**
 * EarnGage Platform - Rows.com API Service
 * 
 * This service provides functions to interact with the Rows.com API
 * for database operations in the EarnGage platform.
 */

import axios from 'axios';

// Configuration - Store these in environment variables in production
// const ROWS_API_KEY = process.env.ROWS_API_KEY || 'your_rows_api_key';
const ROWS_API_KEY = 'rows-1UyEuE7xIVS2rAfXfWCpuuUWKKpLsKokoZoXl2WdXHJm';
const ROWS_WORKSPACE_ID = 'c6e8cbde-6bfb-4771-ac17-e5091d5b6905';
const ROWS_FOLDER_ID = '0fde34b5-9966-420e-a635-2063a2788e8f';
const ROWS_SPREADSHEET_ID = '2Sb44dkdiVpZkU4fUL0xM';

const ROWS_USERS_PAGE_ID = 'd11cea89-6ce8-48d9-b53b-a41b8035ad1d';
const ROWS_USERS_TABLE_ID = 'b3705f9a-15e9-4894-a62e-94c094b05221';

const ROWS_CAMPAIGNS_PAGE_ID = '72031e93-ada8-4b61-a395-6c203fad5dd8';
const ROWS_CAMPAIGNS_TABLE_ID = '912a2e72-8a6d-415a-8d41-e407fa6d3de5';

const ROWS_BASE_URL = `https://api.rows.com/v1`;

// Create axios instance with authentication headers
const rowsApi = axios.create({
  baseURL: ROWS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${ROWS_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Error handler wrapper for API calls
 */
const apiHandler = async (apiCall) => {
  try {
    const response = await apiCall();
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return { 
      success: false, 
      error: error.response ? error.response.data : error.message 
    };
  }
};

/**
 * Generate a UUID for use as table IDs
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Convert JavaScript objects to JSON strings for storage in Rows.com
 */
const objectToJsonString = (obj) => {
  return typeof obj === 'object' ? JSON.stringify(obj) : obj;
};

/**
 * Parse JSON strings from Rows.com to JavaScript objects
 */
const parseJsonString = (str) => {
  if (!str) return null;
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch (e) {
    console.error('Error parsing JSON string:', e);
    return str; // Return original if parsing fails
  }
};

/**
 * Process record for saving to Rows.com (stringify objects)
 */
const prepareRecordForSave = (record) => {
  const processed = {};
  Object.entries(record).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      processed[key] = objectToJsonString(value);
    } else {
      processed[key] = value;
    }
  });
  return processed;
};

/**
 * Process record from Rows.com (parse JSON strings)
 */
const processRecordFromRows = (record) => {
  if (!record) return null;
  
  // Fields that should be parsed as JSON
  const jsonFields = [
    'portfolio_links', 'followers_count', 'engagement_rate', 'bank_details',
    'content_categories', 'showcase_items', 'target_audience', 'brand_colors',
    'social_media_links', 'budget_range', 'niche_category', 'platform_requirements',
    'deliverables', 'target_regions', 'platform_selection', 'expected_metrics'
  ];
  
  const processed = {...record};
  jsonFields.forEach(field => {
    if (processed[field]) {
      processed[field] = parseJsonString(processed[field]);
    }
  });
  
  return processed;
};

// ==========================================
// User Management API Functions
// ==========================================

/**
 * Get all users or filter by criteria
 */
export const getUsers = async (filters = {}) => {
  return apiHandler(async () => {
    let url = `/tables/users/rows`;
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      const filterParams = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' AND ');
      url += `?filter=${encodeURIComponent(filterParams)}`;
    }
    
    const response = await rowsApi.get(url);
    // Process JSON fields in each record
    response.data = response.data.map(processRecordFromRows);
    return response;
  });
};

/**
 * Get a single user by ID
 */
export const getUserById = async (userId) => {
  return apiHandler(async () => {
    const url = `/tables/users/rows?filter=user_id="${userId}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('User not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Get a user by email (for login)
 */
export const getUserByEmail = async (email) => {
  return apiHandler(async () => {
    const url = `/tables/users/rows?filter=email="${email}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('User not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  console.log('From API: ', userData)
  const newUser = {
    id: `usr-${generateUUID().substring(0, 8)}`,
    ...userData,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  return apiHandler(async () => {
    const url = `/spreadsheets/${ROWS_SPREADSHEET_ID}/tables/${ROWS_USERS_TABLE_ID}/values/A:H:append`;
    const payload = { values: [Object.values(prepareRecordForSave(newUser))] };
    console.log(url, payload);
    await rowsApi.post(url, payload);
    return newUser;
  });
};

/**
 * Update an existing user
 */
export const updateUser = async (userId, userData) => {
  return apiHandler(async () => {
    const url = `/tables/users/rows?filter=user_id="${userId}"`;
    const response = await rowsApi.patch(url, prepareRecordForSave(userData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Creator Profile API Functions
// ==========================================

/**
 * Get creator profile by ID
 */
export const getCreatorProfile = async (creatorId) => {
  return apiHandler(async () => {
    const url = `/tables/creator_profiles/rows?filter=creator_id="${creatorId}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('Creator profile not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Create a new creator profile
 */
export const createCreatorProfile = async (profileData) => {
  return apiHandler(async () => {
    const url = `/tables/creator_profiles/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(profileData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

/**
 * Update an existing creator profile
 */
export const updateCreatorProfile = async (creatorId, profileData) => {
  return apiHandler(async () => {
    const url = `/tables/creator_profiles/rows?filter=creator_id="${creatorId}"`;
    const response = await rowsApi.patch(url, prepareRecordForSave(profileData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Brand Profile API Functions
// ==========================================

/**
 * Get brand profile by ID
 */
export const getBrandProfile = async (brandId) => {
  return apiHandler(async () => {
    const url = `/tables/brand_profiles/rows?filter=brand_id="${brandId}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('Brand profile not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Create a new brand profile
 */
export const createBrandProfile = async (profileData) => {
  return apiHandler(async () => {
    const url = `/tables/brand_profiles/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(profileData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

/**
 * Update an existing brand profile
 */
export const updateBrandProfile = async (brandId, profileData) => {
  return apiHandler(async () => {
    const url = `/tables/brand_profiles/rows?filter=brand_id="${brandId}"`;
    const response = await rowsApi.patch(url, prepareRecordForSave(profileData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Campaign API Functions
// ==========================================

/**
 * Get all campaigns or filter by criteria
 */
export const getCampaigns = async (filters = {}) => {
  return apiHandler(async () => {
    let url = `/tables/campaigns/rows`;
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      const filterParams = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' AND ');
      url += `?filter=${encodeURIComponent(filterParams)}`;
    }
    
    const response = await rowsApi.get(url);
    response.data = response.data.map(processRecordFromRows);
    return response;
  });
};

/**
 * Get a single campaign by ID
 */
export const getCampaignById = async (campaignId) => {
  return apiHandler(async () => {
    const url = `/tables/campaigns/rows?filter=campaign_id="${campaignId}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('Campaign not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Create a new campaign
 */
export const createCampaign = async (campaignData) => {
  const newCampaign = {
    campaign_id: campaignData.campaign_id || `cmp-${generateUUID().substring(0, 8)}`,
    creation_date: new Date().toISOString().split('T')[0],  // Current date in YYYY-MM-DD
    ...campaignData
  };
  
  return apiHandler(async () => {
    const url = `/tables/campaigns/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(newCampaign));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

/**
 * Update an existing campaign
 */
export const updateCampaign = async (campaignId, campaignData) => {
  return apiHandler(async () => {
    const url = `/tables/campaigns/rows?filter=campaign_id="${campaignId}"`;
    const response = await rowsApi.patch(url, prepareRecordForSave(campaignData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Application API Functions
// ==========================================

/**
 * Get applications by filter criteria
 */
export const getApplications = async (filters = {}) => {
  return apiHandler(async () => {
    let url = `/tables/applications/rows`;
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      const filterParams = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' AND ');
      url += `?filter=${encodeURIComponent(filterParams)}`;
    }
    
    const response = await rowsApi.get(url);
    response.data = response.data.map(processRecordFromRows);
    return response;
  });
};

/**
 * Get a specific application by ID
 */
export const getApplicationById = async (applicationId) => {
  return apiHandler(async () => {
    const url = `/tables/applications/rows?filter=application_id="${applicationId}"`;
    const response = await rowsApi.get(url);
    if (response.data.length === 0) {
      throw new Error('Application not found');
    }
    response.data = processRecordFromRows(response.data[0]);
    return response;
  });
};

/**
 * Create a new application
 */
export const createApplication = async (applicationData) => {
  const newApplication = {
    application_id: applicationData.application_id || `app-${generateUUID().substring(0, 8)}`,
    date_applied: new Date().toISOString().split('T')[0],  // Current date
    status: 'pending',  // Default status
    payment_status: 'pending',  // Default payment status
    ...applicationData
  };
  
  return apiHandler(async () => {
    const url = `/tables/applications/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(newApplication));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

/**
 * Update an existing application
 */
export const updateApplication = async (applicationId, applicationData) => {
  return apiHandler(async () => {
    const url = `/tables/applications/rows?filter=application_id="${applicationId}"`;
    const response = await rowsApi.patch(url, prepareRecordForSave(applicationData));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Analytics API Functions
// ==========================================

/**
 * Get analytics data by filter criteria
 */
export const getAnalytics = async (filters = {}) => {
  return apiHandler(async () => {
    let url = `/tables/analytics/rows`;
    
    // Add filters if provided
    if (Object.keys(filters).length > 0) {
      const filterParams = Object.entries(filters)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' AND ');
      url += `?filter=${encodeURIComponent(filterParams)}`;
    }
    
    const response = await rowsApi.get(url);
    response.data = response.data.map(processRecordFromRows);
    return response;
  });
};

/**
 * Create a new analytics record
 */
export const createAnalyticsRecord = async (analyticsData) => {
  const newRecord = {
    record_id: analyticsData.record_id || `anl-${generateUUID().substring(0, 8)}`,
    ...analyticsData
  };
  
  return apiHandler(async () => {
    const url = `/tables/analytics/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(newRecord));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// ==========================================
// Notification API Functions
// ==========================================

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId) => {
  return apiHandler(async () => {
    const url = `/tables/notifications/rows?filter=user_id="${userId}"`;
    const response = await rowsApi.get(url);
    response.data = response.data.map(processRecordFromRows);
    return response;
  });
};

/**
 * Create a new notification
 */
export const createNotification = async (notificationData) => {
  const newNotification = {
    notification_id: notificationData.notification_id || `not-${generateUUID().substring(0, 8)}`,
    created_at: new Date().toISOString().split('T')[0],  // Current date
    is_read: false,  // Default to unread
    ...notificationData
  };
  
  return apiHandler(async () => {
    const url = `/tables/notifications/rows`;
    const response = await rowsApi.post(url, prepareRecordForSave(newNotification));
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  return apiHandler(async () => {
    const url = `/tables/notifications/rows?filter=notification_id="${notificationId}"`;
    const response = await rowsApi.patch(url, { is_read: true });
    response.data = processRecordFromRows(response.data);
    return response;
  });
};

// Export service as default
export default {
  // User management
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  
  // Creator profiles
  getCreatorProfile,
  createCreatorProfile,
  updateCreatorProfile,
  
  // Brand profiles
  getBrandProfile,
  createBrandProfile,
  updateBrandProfile,
  
  // Campaigns
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  
  // Applications
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  
  // Analytics
  getAnalytics,
  createAnalyticsRecord,
  
  // Notifications
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
  
  // Utility functions
  generateUUID
};