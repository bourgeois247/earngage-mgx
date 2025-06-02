// src/services/analytics.js
import { rowsApi } from './rowsApi';

/**
 * Record an analytics event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} - Created event
 */
export const recordAnalyticsEvent = async (eventData) => {
  try {
    // Ensure the event has required fields
    const requiredFields = ['eventType'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Add timestamp if not provided
    const event = {
      ...eventData,
      timestamp: eventData.timestamp || new Date()
    };
    
    // Store the event
    return await rowsApi.create('analytics', event);
  } catch (error) {
    console.error('Record analytics event error:', error);
    throw new Error(error.message || 'Error recording analytics event');
  }
};

/**
 * Track campaign view
 * @param {string} campaignId - Campaign ID
 * @param {string} [viewerId] - Viewer user ID
 * @returns {Promise<Object>} - Created event
 */
export const trackCampaignView = async (campaignId, viewerId = null) => {
  try {
    // Check if campaign exists
    const campaign = await rowsApi.getById('campaigns', campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Record the view event
    return await recordAnalyticsEvent({
      eventType: 'campaign_view',
      campaignId,
      userId: viewerId,
      timestamp: new Date(),
      metadata: {
        campaignTitle: campaign.title,
        brandUserId: campaign.brandUserId
      }
    });
  } catch (error) {
    console.error('Track campaign view error:', error);
    // We don't want to throw errors for analytics tracking,
    // as it shouldn't block the main user flow
    console.warn('Failed to track campaign view:', error.message);
    return null;
  }
};

/**
 * Track campaign application
 * @param {string} campaignId - Campaign ID
 * @param {string} creatorId - Creator user ID
 * @returns {Promise<Object>} - Created event
 */
export const trackCampaignApplication = async (campaignId, creatorId) => {
  try {
    // Check if campaign and creator exist
    const [campaign, creator] = await Promise.all([
      rowsApi.getById('campaigns', campaignId),
      rowsApi.getById('users', creatorId)
    ]);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    if (!creator) {
      throw new Error('Creator not found');
    }
    
    // Record the application event
    return await recordAnalyticsEvent({
      eventType: 'campaign_application',
      campaignId,
      userId: creatorId,
      timestamp: new Date(),
      metadata: {
        campaignTitle: campaign.title,
        brandUserId: campaign.brandUserId
      }
    });
  } catch (error) {
    console.error('Track campaign application error:', error);
    console.warn('Failed to track campaign application:', error.message);
    return null;
  }
};

/**
 * Track profile view
 * @param {string} profileId - Profile ID
 * @param {string} profileType - Profile type ('creator' or 'brand')
 * @param {string} [viewerId] - Viewer user ID
 * @returns {Promise<Object>} - Created event
 */
export const trackProfileView = async (profileId, profileType, viewerId = null) => {
  try {
    if (!['creator', 'brand'].includes(profileType)) {
      throw new Error('Invalid profile type. Must be "creator" or "brand"');
    }
    
    // Record the profile view event
    return await recordAnalyticsEvent({
      eventType: 'profile_view',
      profileId,
      profileType,
      userId: viewerId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Track profile view error:', error);
    console.warn('Failed to track profile view:', error.message);
    return null;
  }
};

/**
 * Get campaign view analytics
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - View statistics
 */
export const getCampaignViewAnalytics = async (campaignId) => {
  try {
    // Get all view events for this campaign
    const viewEvents = await rowsApi.query('analytics', {
      eventType: 'campaign_view',
      campaignId
    });
    
    // Calculate total views
    const totalViews = viewEvents.length;
    
    // Calculate unique viewers
    const uniqueViewers = new Set(viewEvents
      .map(event => event.userId)
      .filter(userId => userId !== null)
    ).size;
    
    // Group views by date
    const viewsByDate = viewEvents.reduce((acc, event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format for easier charting
    const viewsOverTime = Object.entries(viewsByDate).map(([date, count]) => ({
      date,
      views: count
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      campaignId,
      totalViews,
      uniqueViewers,
      viewsOverTime
    };
  } catch (error) {
    console.error('Get campaign view analytics error:', error);
    throw new Error(error.message || 'Error fetching campaign view analytics');
  }
};

/**
 * Get campaign application analytics
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - Application statistics
 */
export const getCampaignApplicationAnalytics = async (campaignId) => {
  try {
    // Get all applications for this campaign
    const applications = await rowsApi.query('applications', { campaignId });
    
    // Calculate metrics
    const totalApplications = applications.length;
    const applicationsByStatus = {
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      completed: applications.filter(app => app.status === 'completed').length
    };
    
    // Calculate average price if there are applications with price
    let averagePrice = 0;
    const applicationsWithPrice = applications.filter(app => app.price);
    if (applicationsWithPrice.length > 0) {
      const totalPrice = applicationsWithPrice.reduce(
        (sum, app) => sum + parseFloat(app.price || 0), 
        0
      );
      averagePrice = totalPrice / applicationsWithPrice.length;
    }
    
    // Group applications by date
    const applicationsByDate = applications.reduce((acc, app) => {
      const date = new Date(app.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format for easier charting
    const applicationsOverTime = Object.entries(applicationsByDate)
      .map(([date, count]) => ({
        date,
        applications: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      campaignId,
      totalApplications,
      applicationsByStatus,
      averagePrice,
      applicationsOverTime
    };
  } catch (error) {
    console.error('Get campaign application analytics error:', error);
    throw new Error(error.message || 'Error fetching campaign application analytics');
  }
};

/**
 * Get creator analytics
 * @param {string} creatorId - Creator user ID
 * @returns {Promise<Object>} - Creator statistics
 */
export const getCreatorAnalytics = async (creatorId) => {
  try {
    // Get creator's applications
    const applications = await rowsApi.query('applications', { creatorUserId: creatorId });
    
    // Get profile views
    const creatorProfiles = await rowsApi.query('creator_profiles', { userId: creatorId });
    let profileViews = [];
    
    if (creatorProfiles && creatorProfiles.length > 0) {
      const creatorProfileId = creatorProfiles[0].id;
      profileViews = await rowsApi.query('analytics', {
        eventType: 'profile_view',
        profileId: creatorProfileId,
        profileType: 'creator'
      });
    }
    
    // Calculate metrics
    const stats = {
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        completed: applications.filter(app => app.status === 'completed').length
      },
      totalProfileViews: profileViews.length,
      uniqueProfileViewers: new Set(profileViews
        .map(event => event.userId)
        .filter(userId => userId !== null)
      ).size
    };
    
    // Calculate application success rate
    const decidedApplications = applications.filter(
      app => ['approved', 'rejected'].includes(app.status)
    );
    
    if (decidedApplications.length > 0) {
      const approvedCount = applications.filter(app => app.status === 'approved').length;
      stats.applicationSuccessRate = (approvedCount / decidedApplications.length) * 100;
    } else {
      stats.applicationSuccessRate = 0;
    }
    
    return stats;
  } catch (error) {
    console.error('Get creator analytics error:', error);
    throw new Error(error.message || 'Error fetching creator analytics');
  }
};

/**
 * Get brand analytics
 * @param {string} brandId - Brand user ID
 * @returns {Promise<Object>} - Brand statistics
 */
export const getBrandAnalytics = async (brandId) => {
  try {
    // Get brand's campaigns
    const campaigns = await rowsApi.query('campaigns', { brandUserId: brandId });
    
    // Get profile views
    const brandProfiles = await rowsApi.query('brand_profiles', { userId: brandId });
    let profileViews = [];
    
    if (brandProfiles && brandProfiles.length > 0) {
      const brandProfileId = brandProfiles[0].id;
      profileViews = await rowsApi.query('analytics', {
        eventType: 'profile_view',
        profileId: brandProfileId,
        profileType: 'brand'
      });
    }
    
    // Initialize stats
    const stats = {
      totalCampaigns: campaigns.length,
      campaignsByStatus: {
        draft: campaigns.filter(camp => camp.status === 'draft').length,
        active: campaigns.filter(camp => camp.status === 'active').length,
        completed: campaigns.filter(camp => camp.status === 'completed').length,
        cancelled: campaigns.filter(camp => camp.status === 'cancelled').length
      },
      totalProfileViews: profileViews.length,
      uniqueProfileViewers: new Set(profileViews
        .map(event => event.userId)
        .filter(userId => userId !== null)
      ).size,
      totalApplicationsReceived: 0,
      applicationsByStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0
      }
    };
    
    // Get applications for all campaigns
    for (const campaign of campaigns) {
      const campaignApplications = await rowsApi.query('applications', { campaignId: campaign.id });
      
      // Add to total count
      stats.totalApplicationsReceived += campaignApplications.length;
      
      // Add to status counts
      stats.applicationsByStatus.pending += campaignApplications.filter(app => app.status === 'pending').length;
      stats.applicationsByStatus.approved += campaignApplications.filter(app => app.status === 'approved').length;
      stats.applicationsByStatus.rejected += campaignApplications.filter(app => app.status === 'rejected').length;
      stats.applicationsByStatus.completed += campaignApplications.filter(app => app.status === 'completed').length;
      
      // Get campaign views
      const campaignViews = await rowsApi.query('analytics', {
        eventType: 'campaign_view',
        campaignId: campaign.id
      });
      
      // Add campaign-specific data
      if (!stats.campaignStats) {
        stats.campaignStats = [];
      }
      
      stats.campaignStats.push({
        campaignId: campaign.id,
        title: campaign.title,
        views: campaignViews.length,
        applications: campaignApplications.length,
        conversionRate: campaignViews.length > 0 
          ? (campaignApplications.length / campaignViews.length) * 100 
          : 0
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Get brand analytics error:', error);
    throw new Error(error.message || 'Error fetching brand analytics');
  }
};

/**
 * Get platform-wide analytics
 * @returns {Promise<Object>} - Platform statistics
 */
export const getPlatformAnalytics = async () => {
  try {
    // Get counts from each table
    const [users, creators, brands, campaigns, applications] = await Promise.all([
      rowsApi.count('users'),
      rowsApi.count('creator_profiles'),
      rowsApi.count('brand_profiles'),
      rowsApi.count('campaigns'),
      rowsApi.count('applications')
    ]);
    
    // Calculate user registration distribution over time
    const allUsers = await rowsApi.getAll('users');
    const usersByDate = allUsers.reduce((acc, user) => {
      const date = new Date(user.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format for easier charting
    const userGrowth = Object.entries(usersByDate)
      .map(([date, count]) => ({
        date,
        newUsers: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate cumulative user growth
    let cumulativeUsers = 0;
    const cumulativeUserGrowth = userGrowth.map(point => {
      cumulativeUsers += point.newUsers;
      return {
        date: point.date,
        totalUsers: cumulativeUsers
      };
    });
    
    // Calculate campaign creation distribution
    const allCampaigns = await rowsApi.getAll('campaigns');
    const campaignsByDate = allCampaigns.reduce((acc, campaign) => {
      const date = new Date(campaign.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    // Convert to array format
    const campaignGrowth = Object.entries(campaignsByDate)
      .map(([date, count]) => ({
        date,
        newCampaigns: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Get all analytics events
    const allEvents = await rowsApi.getAll('analytics');
    const eventsByType = allEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {});
    
    return {
      userCounts: {
        total: users,
        creators,
        brands
      },
      contentCounts: {
        campaigns,
        applications
      },
      userGrowth,
      cumulativeUserGrowth,
      campaignGrowth,
      eventsByType
    };
  } catch (error) {
    console.error('Get platform analytics error:', error);
    throw new Error(error.message || 'Error fetching platform analytics');
  }
};

/**
 * Get analytics by date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} [eventType] - Optional event type filter
 * @returns {Promise<Array>} - Analytics events in range
 */
export const getAnalyticsByDateRange = async (startDate, endDate, eventType = null) => {
  try {
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }
    
    if (start > end) {
      throw new Error('Start date must be before end date');
    }
    
    // Convert to ISO strings for comparison
    const startISO = start.toISOString();
    const endISO = new Date(end.setHours(23, 59, 59, 999)).toISOString();
    
    // Build filter for the query
    const filter = {
      timestamp_gte: startISO,
      timestamp_lte: endISO
    };
    
    // Add event type filter if provided
    if (eventType) {
      filter.eventType = eventType;
    }
    
    // Get analytics events in the date range
    const events = await rowsApi.query('analytics', filter, {
      orderBy: 'timestamp',
      orderDirection: 'asc'
    });
    
    return events;
  } catch (error) {
    console.error('Get analytics by date range error:', error);
    throw new Error(error.message || 'Error fetching analytics by date range');
  }
};

export default {
  recordAnalyticsEvent,
  trackCampaignView,
  trackCampaignApplication,
  trackProfileView,
  getCampaignViewAnalytics,
  getCampaignApplicationAnalytics,
  getCreatorAnalytics,
  getBrandAnalytics,
  getPlatformAnalytics,
  getAnalyticsByDateRange
};