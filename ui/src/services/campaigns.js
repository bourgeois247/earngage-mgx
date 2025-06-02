// src/services/campaigns.js
import { rowsApi } from './rowsApi';

/**
 * Create a new campaign
 * @param {Object} campaignData - Campaign data
 * @returns {Promise<Object>} - Created campaign
 */
export const createCampaign = async (campaignData) => {
  try {
    // Ensure required fields are present
    const requiredFields = ['brandUserId', 'title', 'description', 'requirements', 'budget'];
    for (const field of requiredFields) {
      if (!campaignData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Add timestamps
    const campaign = {
      ...campaignData,
      status: campaignData.status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the campaign in the database
    return await rowsApi.create('campaigns', campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    throw new Error(error.message || 'Error creating campaign');
  }
};

/**
 * Get a campaign by ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - Campaign data
 */
export const getCampaignById = async (campaignId) => {
  try {
    return await rowsApi.getById('campaigns', campaignId);
  } catch (error) {
    console.error('Get campaign error:', error);
    throw new Error(error.message || 'Error fetching campaign');
  }
};

/**
 * Update a campaign
 * @param {string} campaignId - Campaign ID
 * @param {Object} campaignData - Updated campaign data
 * @returns {Promise<Object>} - Updated campaign
 */
export const updateCampaign = async (campaignId, campaignData) => {
  try {
    // First verify the campaign exists
    const existingCampaign = await rowsApi.getById('campaigns', campaignId);
    
    if (!existingCampaign) {
      throw new Error('Campaign not found');
    }
    
    // Update the campaign
    const updatedCampaign = {
      ...campaignData,
      updatedAt: new Date()
    };
    
    return await rowsApi.update('campaigns', campaignId, updatedCampaign);
  } catch (error) {
    console.error('Update campaign error:', error);
    throw new Error(error.message || 'Error updating campaign');
  }
};

/**
 * Delete a campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteCampaign = async (campaignId) => {
  try {
    // First check if the campaign exists
    const campaign = await rowsApi.getById('campaigns', campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Delete the campaign
    await rowsApi.delete('campaigns', campaignId);
    return true;
  } catch (error) {
    console.error('Delete campaign error:', error);
    throw new Error(error.message || 'Error deleting campaign');
  }
};

/**
 * Get all campaigns
 * @param {Object} query - Optional query parameters
 * @returns {Promise<Array>} - Array of campaigns
 */
export const getAllCampaigns = async (query = {}) => {
  try {
    const { page = 1, pageSize = 10, ...filters } = query;
    
    return await rowsApi.query('campaigns', filters, {
      page,
      pageSize,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  } catch (error) {
    console.error('Get all campaigns error:', error);
    throw new Error(error.message || 'Error fetching campaigns');
  }
};

/**
 * Get campaigns by brand user ID
 * @param {string} brandUserId - Brand user ID
 * @returns {Promise<Array>} - Array of campaigns
 */
export const getCampaignsByBrandUserId = async (brandUserId) => {
  try {
    return await rowsApi.query('campaigns', { brandUserId }, {
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  } catch (error) {
    console.error('Get brand campaigns error:', error);
    throw new Error(error.message || 'Error fetching brand campaigns');
  }
};

/**
 * Get active campaigns
 * @param {Object} query - Optional additional query parameters
 * @returns {Promise<Array>} - Array of active campaigns
 */
export const getActiveCampaigns = async (query = {}) => {
  try {
    const { page = 1, pageSize = 10, ...filters } = query;
    
    // Add status filter for active campaigns
    const activeFilters = {
      ...filters,
      status: 'active'
    };
    
    return await rowsApi.query('campaigns', activeFilters, {
      page,
      pageSize,
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  } catch (error) {
    console.error('Get active campaigns error:', error);
    throw new Error(error.message || 'Error fetching active campaigns');
  }
};

/**
 * Search campaigns by criteria
 * @param {Object} criteria - Search criteria
 * @returns {Promise<Array>} - Array of matching campaigns
 */
export const searchCampaigns = async (criteria = {}) => {
  try {
    // Build search filters
    const filters = {};
    
    if (criteria.searchTerm) {
      // Search in title and description
      filters.title_contains = criteria.searchTerm;
      // Note: Rows.com might not support OR conditions, so this is a simplification
    }
    
    if (criteria.category) {
      filters.category = criteria.category;
    }
    
    if (criteria.minBudget) {
      filters.budget_gte = criteria.minBudget;
    }
    
    if (criteria.maxBudget) {
      filters.budget_lte = criteria.maxBudget;
    }
    
    if (criteria.status) {
      filters.status = criteria.status;
    }
    
    if (criteria.startDateFrom) {
      filters.startDate_gte = criteria.startDateFrom;
    }
    
    if (criteria.startDateTo) {
      filters.startDate_lte = criteria.startDateTo;
    }
    
    // Execute the search
    const { page = 1, pageSize = 10 } = criteria;
    return await rowsApi.query('campaigns', filters, {
      page,
      pageSize,
      orderBy: criteria.orderBy || 'created_at',
      orderDirection: criteria.orderDirection || 'desc'
    });
  } catch (error) {
    console.error('Search campaigns error:', error);
    throw new Error(error.message || 'Error searching campaigns');
  }
};

/**
 * Change campaign status
 * @param {string} campaignId - Campaign ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated campaign
 */
export const changeCampaignStatus = async (campaignId, status) => {
  try {
    // Validate status
    const validStatuses = ['draft', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Update the campaign status
    return await updateCampaign(campaignId, { status });
  } catch (error) {
    console.error('Change campaign status error:', error);
    throw new Error(error.message || 'Error changing campaign status');
  }
};

/**
 * Get campaign statistics
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - Campaign statistics
 */
export const getCampaignStats = async (campaignId) => {
  try {
    // First check if the campaign exists
    const campaign = await rowsApi.getById('campaigns', campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Get all applications for this campaign
    const applications = await rowsApi.query('applications', { campaignId });
    
    // Calculate statistics
    const stats = {
      campaignId,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      approvedApplications: applications.filter(app => app.status === 'approved').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      completedApplications: applications.filter(app => app.status === 'completed').length
    };
    
    // Get analytics data
    try {
      const viewEvents = await rowsApi.query('analytics', {
        eventType: 'campaign_view',
        campaignId
      });
      
      stats.totalViews = viewEvents.length;
      
      // Count unique viewers
      const uniqueViewers = new Set(viewEvents.map(event => event.userId).filter(Boolean));
      stats.uniqueViewers = uniqueViewers.size;
      
    } catch (error) {
      // If analytics query fails, continue with available stats
      console.warn('Failed to fetch analytics for campaign stats:', error);
    }
    
    return stats;
  } catch (error) {
    console.error('Get campaign stats error:', error);
    throw new Error(error.message || 'Error fetching campaign statistics');
  }
};

/**
 * Get recommended campaigns for a creator
 * @param {string} creatorUserId - Creator user ID
 * @returns {Promise<Array>} - Array of recommended campaigns
 */
export const getRecommendedCampaigns = async (creatorUserId) => {
  try {
    // Get creator profile to determine interests/categories
    const creatorProfiles = await rowsApi.query('creator_profiles', { userId: creatorUserId });
    
    if (!creatorProfiles || creatorProfiles.length === 0) {
      throw new Error('Creator profile not found');
    }
    
    const creatorProfile = creatorProfiles[0];
    const categories = creatorProfile.categories || [];
    
    // Get active campaigns that match creator's categories
    let recommendedCampaigns = [];
    
    if (categories.length > 0) {
      // Get campaigns that match at least one category
      // This is a simplified approach - actual recommendation might need more complex logic
      recommendedCampaigns = await rowsApi.query('campaigns', {
        status: 'active',
        // Here we'd ideally filter by category matching, but it depends on Rows.com's filtering capabilities
        // This is a placeholder approach:
        // category_in: categories
      }, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        limit: 10
      });
      
      // If Rows doesn't support direct category array matching, we can filter manually:
      recommendedCampaigns = recommendedCampaigns.filter(campaign => 
        campaign.category && categories.includes(campaign.category)
      );
    }
    
    // If we don't have enough recommended campaigns, get other active campaigns
    if (recommendedCampaigns.length < 5) {
      const otherCampaigns = await rowsApi.query('campaigns', {
        status: 'active'
      }, {
        orderBy: 'created_at',
        orderDirection: 'desc',
        limit: 10
      });
      
      // Filter out any campaigns already in the recommended list
      const recommendedIds = new Set(recommendedCampaigns.map(c => c.id));
      const additionalCampaigns = otherCampaigns.filter(c => !recommendedIds.has(c.id));
      
      // Add additional campaigns to get at least 5 total recommendations
      recommendedCampaigns = [
        ...recommendedCampaigns,
        ...additionalCampaigns.slice(0, 5 - recommendedCampaigns.length)
      ];
    }
    
    return recommendedCampaigns;
  } catch (error) {
    console.error('Get recommended campaigns error:', error);
    throw new Error(error.message || 'Error fetching recommended campaigns');
  }
};

export default {
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignsByBrandUserId,
  getActiveCampaigns,
  searchCampaigns,
  changeCampaignStatus,
  getCampaignStats,
  getRecommendedCampaigns
};