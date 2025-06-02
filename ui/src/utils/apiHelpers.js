// src/utils/apiHelpers.js

/**
 * Format error response from API
 * @param {Error} error - Error object
 * @returns {Object} - Formatted error object
 */
export const formatError = (error) => {
  // Default error structure
  const formattedError = {
    message: 'An unexpected error occurred',
    status: 500,
    details: null
  };

  // Handle axios errors
  if (error.response) {
    // Server responded with a status code outside of 2xx
    formattedError.message = error.response.data?.message || 'Server error';
    formattedError.status = error.response.status;
    formattedError.details = error.response.data;
  } else if (error.request) {
    // Request made but no response received
    formattedError.message = 'No response from server';
    formattedError.status = 0;
  } else {
    // Error setting up request
    formattedError.message = error.message || 'Request error';
  }

  // If it's a custom error with message
  if (error.message) {
    formattedError.message = error.message;
  }

  return formattedError;
};

/**
 * Format request data for API
 * @param {Object} data - Request data
 * @returns {Object} - Formatted request data
 */
export const formatRequestData = (data) => {
  // Create a deep copy to avoid mutating the original object
  const formattedData = JSON.parse(JSON.stringify(data));

  // Handle Date objects - convert to ISO strings for Rows.com
  for (const key in formattedData) {
    if (formattedData[key] instanceof Date) {
      formattedData[key] = formattedData[key].toISOString();
    } else if (typeof formattedData[key] === 'object' && formattedData[key] !== null) {
      formattedData[key] = formatRequestData(formattedData[key]);
    }
  }

  return formattedData;
};

/**
 * Format response data from API
 * @param {Object} data - Response data
 * @returns {Object} - Formatted response data
 */
export const formatResponseData = (data) => {
  // If data is null or undefined, return as is
  if (!data) return data;

  // If data is an array, format each item
  if (Array.isArray(data)) {
    return data.map(item => formatResponseData(item));
  }

  // If data is not an object, return as is
  if (typeof data !== 'object') return data;

  // Create a new object to avoid mutating the original
  const formatted = { ...data };

  // Process date strings - convert to Date objects
  for (const key in formatted) {
    if (typeof formatted[key] === 'string') {
      // Check if the string is an ISO date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
      if (dateRegex.test(formatted[key])) {
        const parsedDate = new Date(formatted[key]);
        if (!isNaN(parsedDate.getTime())) {
          formatted[key] = parsedDate;
        }
      }
    } else if (typeof formatted[key] === 'object' && formatted[key] !== null) {
      // Recursively format nested objects
      formatted[key] = formatResponseData(formatted[key]);
    }
  }

  return formatted;
};

/**
 * Build pagination parameters for API queries
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Number of items per page
 * @returns {Object} - Pagination parameters
 */
export const buildPaginationParams = (page, pageSize) => {
  const offset = (page - 1) * pageSize;
  
  return {
    offset,
    limit: pageSize
  };
};

/**
 * Convert object to query string
 * @param {Object} params - Query parameters
 * @returns {string} - Formatted query string
 */
export const objectToQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const parts = [];
  
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      let value = params[key];
      
      // Handle arrays
      if (Array.isArray(value)) {
        value = value.join(',');
      }
      
      // Handle objects (for complex filters)
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }
      
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  
  return parts.length ? `?${parts.join('&')}` : '';
};

/**
 * Format filters for Rows.com API
 * @param {Object} filters - Filter criteria
 * @returns {Object} - Formatted filters for Rows.com
 */
export const formatFilters = (filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return {};
  }
  
  const formattedFilters = {};
  
  // Process each filter
  for (const key in filters) {
    // Skip null/undefined values
    if (filters[key] === null || filters[key] === undefined) {
      continue;
    }
    
    // Special handling for operator suffixes (_gt, _lt, etc.)
    if (key.includes('_')) {
      const [field, operator] = key.split('_');
      
      // Handle common operators
      switch (operator) {
        case 'gt':
          formattedFilters[`${field}.gt`] = filters[key];
          break;
        case 'gte':
          formattedFilters[`${field}.gte`] = filters[key];
          break;
        case 'lt':
          formattedFilters[`${field}.lt`] = filters[key];
          break;
        case 'lte':
          formattedFilters[`${field}.lte`] = filters[key];
          break;
        case 'contains':
          formattedFilters[`${field}.contains`] = filters[key];
          break;
        case 'in':
          formattedFilters[`${field}.in`] = Array.isArray(filters[key]) 
            ? filters[key] 
            : [filters[key]];
          break;
        default:
          // For custom operators, pass as is
          formattedFilters[key] = filters[key];
      }
    } else {
      // Standard equality filter
      formattedFilters[key] = filters[key];
    }
  }
  
  return formattedFilters;
};

/**
 * Normalize data keys from snake_case to camelCase
 * @param {Object|Array} data - Data to normalize
 * @returns {Object|Array} - Normalized data
 */
export const normalizeToCamelCase = (data) => {
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => normalizeToCamelCase(item));
  }
  
  // Handle null or non-objects
  if (data === null || typeof data !== 'object') {
    return data;
  }
  
  // Convert object keys
  const normalized = {};
  
  for (const key in data) {
    // Convert key from snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    
    // Recursively normalize values
    normalized[camelKey] = typeof data[key] === 'object' && data[key] !== null
      ? normalizeToCamelCase(data[key])
      : data[key];
  }
  
  return normalized;
};

/**
 * Normalize data keys from camelCase to snake_case
 * @param {Object|Array} data - Data to normalize
 * @returns {Object|Array} - Normalized data
 */
export const normalizeToSnakeCase = (data) => {
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => normalizeToSnakeCase(item));
  }
  
  // Handle null or non-objects
  if (data === null || typeof data !== 'object') {
    return data;
  }
  
  // Convert object keys
  const normalized = {};
  
  for (const key in data) {
    // Convert key from camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
    
    // Recursively normalize values
    normalized[snakeKey] = typeof data[key] === 'object' && data[key] !== null
      ? normalizeToSnakeCase(data[key])
      : data[key];
  }
  
  return normalized;
};

export default {
  formatError,
  formatRequestData,
  formatResponseData,
  buildPaginationParams,
  objectToQueryString,
  formatFilters,
  normalizeToCamelCase,
  normalizeToSnakeCase
};