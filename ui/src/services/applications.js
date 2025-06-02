// src/services/applications.js
import { rowsApi } from './rowsApi';

/**
 * Create a new application
 * @param {Object} applicationData - Application data
 * @returns {Promise<Object>} - Created application
 */
export const createApplication = async (applicationData) => {
  try {
    // Ensure required fields are present
    const requiredFields = ['campaignId', 'creatorUserId', 'proposal'];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    // Check if the campaign exists
    const campaign = await rowsApi.getById('campaigns', applicationData.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Check if the creator exists
    const users = await rowsApi.query('users', { id: applicationData.creatorUserId });
    if (!users || users.length === 0) {
      throw new Error('Creator not found');
    }
    
    // Check if creator has already applied to this campaign
    const existingApplications = await rowsApi.query('applications', {
      campaignId: applicationData.campaignId,
      creatorUserId: applicationData.creatorUserId
    });
    
    if (existingApplications && existingApplications.length > 0) {
      throw new Error('You have already applied to this campaign');
    }
    
    // Add timestamps and default status
    const application = {
      ...applicationData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create the application in the database
    const createdApplication = await rowsApi.create('applications', application);
    
    // Track the application event in analytics
    try {
      await rowsApi.create('analytics', {
        eventType: 'campaign_application',
        userId: applicationData.creatorUserId,
        campaignId: applicationData.campaignId,
        timestamp: new Date(),
        metadata: {
          applicationId: createdApplication.id
        }
      });
    } catch (analyticsError) {
      console.warn('Failed to track application analytics:', analyticsError);
    }
    
    return createdApplication;
  } catch (error) {
    console.error('Create application error:', error);
    throw new Error(error.message || 'Error creating application');
  }
};

/**
 * Get an application by ID
 * @param {string} applicationId - Application ID
 * @returns {Promise<Object>} - Application data
 */
export const getApplicationById = async (applicationId) => {
  try {
    return await rowsApi.getById('applications', applicationId);
  } catch (error) {
    console.error('Get application error:', error);
    throw new Error(error.message || 'Error fetching application');
  }
};

/**
 * Update an application
 * @param {string} applicationId - Application ID
 * @param {Object} applicationData - Updated application data
 * @returns {Promise<Object>} - Updated application
 */
export const updateApplication = async (applicationId, applicationData) => {
  try {
    // First verify the application exists
    const existingApplication = await rowsApi.getById('applications', applicationId);
    
    if (!existingApplication) {
      throw new Error('Application not found');
    }
    
    // Only allow updates for certain fields if the application is still pending
    if (existingApplication.status !== 'pending' && 
        (applicationData.proposal || applicationData.price)) {
      throw new Error('Cannot update proposal or price after application has been reviewed');
    }
    
    // Update the application
    const updatedApplication = {
      ...applicationData,
      updatedAt: new Date()
    };
    
    return await rowsApi.update('applications', applicationId, updatedApplication);
  } catch (error) {
    console.error('Update application error:', error);
    throw new Error(error.message || 'Error updating application');
  }
};

/**
 * Delete an application
 * @param {string} applicationId - Application ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteApplication = async (applicationId) => {
  try {
    // First check if the application exists
    const application = await rowsApi.getById('applications', applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    // Only allow deletion if the application is still pending
    if (application.status !== 'pending') {
      throw new Error('Cannot delete an application that has been reviewed');
    }
    
    // Delete the application
    await rowsApi.delete('applications', applicationId);
    return true;
  } catch (error) {
    console.error('Delete application error:', error);
    throw new Error(error.message || 'Error deleting application');
  }
};

/**
 * Get all applications for a specific campaign
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Array>} - Array of applications
 */
export const getApplicationsByCampaignId = async (campaignId) => {
  try {
    // First check if the campaign exists
    const campaign = await rowsApi.getById('campaigns', campaignId);
    
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    // Get all applications for this campaign
    const applications = await rowsApi.query('applications', { campaignId }, {
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    
    // For each application, get the creator's profile
    const applicationsWithCreator = await Promise.all(applications.map(async (application) => {
      try {
        // Get creator profile
        const creatorProfiles = await rowsApi.query('creator_profiles', { userId: application.creatorUserId });
        const creatorProfile = creatorProfiles[0] || {};
        
        // Get creator user details for email
        const creatorUser = await rowsApi.getById('users', application.creatorUserId);
        
        return {
          ...application,
          creator: {
            ...creatorProfile,
            email: creatorUser?.email || ''
          }
        };
      } catch (error) {
        // If profile fetch fails, just return the application without creator details
        return application;
      }
    }));
    
    return applicationsWithCreator;
  } catch (error) {
    console.error('Get campaign applications error:', error);
    throw new Error(error.message || 'Error fetching campaign applications');
  }
};

/**
 * Get all applications submitted by a creator
 * @param {string} creatorUserId - Creator user ID
 * @returns {Promise<Array>} - Array of applications
 */
export const getApplicationsByCreatorId = async (creatorUserId) => {
  try {
    // Check if the creator exists
    const users = await rowsApi.query('users', { id: creatorUserId });
    
    if (!users || users.length === 0) {
      throw new Error('Creator not found');
    }
    
    // Get all applications by this creator
    const applications = await rowsApi.query('applications', { creatorUserId }, {
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
    
    // For each application, get the campaign details
    const applicationsWithCampaign = await Promise.all(applications.map(async (application) => {
      try {
        // Get campaign details
        const campaign = await rowsApi.getById('campaigns', application.campaignId);
        
        // Get brand details
        const brandProfiles = await rowsApi.query('brand_profiles', { userId: campaign.brandUserId });
        const brandProfile = brandProfiles[0] || {};
        
        return {
          ...application,
          campaign: {
            ...campaign,
            brand: brandProfile
          }
        };
      } catch (error) {
        // If campaign fetch fails, just return the application without campaign details
        return application;
      }
    }));
    
    return applicationsWithCampaign;
  } catch (error) {
    console.error('Get creator applications error:', error);
    throw new Error(error.message || 'Error fetching creator applications');
  }
};

/**
 * Change application status
 * @param {string} applicationId - Application ID
 * @param {string} status - New status
 * @param {string} [feedback] - Optional feedback
 * @returns {Promise<Object>} - Updated application
 */
export const changeApplicationStatus = async (applicationId, status, feedback = '') => {
  try {
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Get the current application
    const application = await rowsApi.getById('applications', applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    // Check for valid status transitions
    if (application.status === 'rejected' && status !== 'pending') {
      throw new Error('Cannot change status of rejected applications');
    }
    
    if (application.status === 'completed') {
      throw new Error('Cannot change status of completed applications');
    }
    
    // Update the application
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    // Add feedback if provided
    if (feedback) {
      updateData.feedback = feedback;
    }
    
    return await rowsApi.update('applications', applicationId, updateData);
  } catch (error) {
    console.error('Change application status error:', error);
    throw new Error(error.message || 'Error changing application status');
  }
};

/**
 * Get all applications with a specific status
 * @param {string} status - Application status
 * @returns {Promise<Array>} - Array of applications
 */
export const getApplicationsByStatus = async (status) => {
  try {
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    // Get applications with this status
    return await rowsApi.query('applications', { status }, {
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  } catch (error) {
    console.error('Get applications by status error:', error);
    throw new Error(error.message || 'Error fetching applications');
  }
};

/**
 * Check if a creator has already applied to a campaign
 * @param {string} creatorUserId - Creator user ID
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<boolean>} - True if already applied
 */
export const hasCreatorAppliedToCampaign = async (creatorUserId, campaignId) => {
  try {
    // Check for existing applications
    const applications = await rowsApi.query('applications', {
      creatorUserId,
      campaignId
    });
    
    return applications && applications.length > 0;
  } catch (error) {
    console.error('Check application existence error:', error);
    throw new Error(error.message || 'Error checking application status');
  }
};

/**
 * Get application analytics
 * @param {string} campaignId - Campaign ID
 * @returns {Promise<Object>} - Application analytics
 */
export const getApplicationAnalytics = async (campaignId) => {
  try {
    // Get all applications for this campaign
    const applications = await rowsApi.query('applications', { campaignId });
    
    // Calculate metrics
    const stats = {
      total: applications.length,
      byStatus: {
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        completed: applications.filter(app => app.status === 'completed').length
      },
      averagePrice: 0
    };
    
    // Calculate average price if there are applications with price data
    const applicationsWithPrice = applications.filter(app => app.price);
    if (applicationsWithPrice.length > 0) {
      const totalPrice = applicationsWithPrice.reduce((sum, app) => sum + parseFloat(app.price), 0);
      stats.averagePrice = totalPrice / applicationsWithPrice.length;
    }
    
    return stats;
  } catch (error) {
    console.error('Get application analytics error:', error);
    throw new Error(error.message || 'Error fetching application analytics');
  }
};

export default {
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationsByCampaignId,
  getApplicationsByCreatorId,
  changeApplicationStatus,
  getApplicationsByStatus,
  hasCreatorAppliedToCampaign,
  getApplicationAnalytics
};