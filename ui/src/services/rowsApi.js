// src/services/rowsApi.js
import axios from 'axios';
import { formatError, formatRequestData, formatResponseData, buildPaginationParams } from '../utils/apiHelpers';

/**
 * Service for direct interaction with the Rows.com API
 */
class RowsApi {
  constructor() {
    // Create an axios instance with default config
    this.client = axios.create({
      baseURL: import.meta.env.VITE_ROWS_API_URL || 'https://api.rows.com/v1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    // Add request interceptor to add API key to all requests
    this.client.interceptors.request.use(config => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      config.headers['X-API-Key'] = import.meta.env.VITE_ROWS_API_KEY;
      return config;
    }, error => {
      return Promise.reject(error);
    });
    
    // Add response interceptor to format responses
    this.client.interceptors.response.use(response => {
      return response;
    }, error => {
      return Promise.reject(formatError(error));
    });
  }

  /**
   * Make a GET request to the Rows.com API
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Parsed response data
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return formatResponseData(response.data);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a POST request to the Rows.com API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise<Object>} - Parsed response data
   */
  async post(endpoint, data = {}) {
    try {
      const formattedData = formatRequestData(data);
      const response = await this.client.post(endpoint, formattedData);
      return formatResponseData(response.data);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a PUT request to the Rows.com API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise<Object>} - Parsed response data
   */
  async put(endpoint, data = {}) {
    try {
      const formattedData = formatRequestData(data);
      const response = await this.client.put(endpoint, formattedData);
      return formatResponseData(response.data);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a PATCH request to the Rows.com API
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise<Object>} - Parsed response data
   */
  async patch(endpoint, data = {}) {
    try {
      const formattedData = formatRequestData(data);
      const response = await this.client.patch(endpoint, formattedData);
      return formatResponseData(response.data);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Make a DELETE request to the Rows.com API
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Parsed response data
   */
  async delete(endpoint, params = {}) {
    try {
      const response = await this.client.delete(endpoint, { params });
      return formatResponseData(response.data);
    } catch (error) {
      throw formatError(error);
    }
  }

  /**
   * Get all records from a table
   * @param {string} table - Table name
   * @param {Object} query - Query parameters
   * @returns {Promise<Array>} - Array of records
   */
  async getAll(table, query = {}) {
    const { page = 1, pageSize = 10, ...filters } = query;
    const params = {
      ...buildPaginationParams(page, pageSize),
      ...filters
    };
    return this.get(`/tables/${table}/rows`, params);
  }

  /**
   * Get a single record by ID
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @returns {Promise<Object>} - Record data
   */
  async getById(table, id) {
    return this.get(`/tables/${table}/rows/${id}`);
  }

  /**
   * Create a new record
   * @param {string} table - Table name
   * @param {Object} data - Record data
   * @returns {Promise<Object>} - Created record
   */
  async create(table, data) {
    return this.post(`/tables/${table}/rows`, data);
  }

  /**
   * Update a record
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @param {Object} data - Updated fields
   * @returns {Promise<Object>} - Updated record
   */
  async update(table, id, data) {
    return this.put(`/tables/${table}/rows/${id}`, data);
  }

  /**
   * Delete a record
   * @param {string} table - Table name
   * @param {string} id - Record ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(table, id) {
    await this.delete(`/tables/${table}/rows/${id}`);
    return true;
  }

  /**
   * Query records with custom filters
   * @param {string} table - Table name
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Additional options like pagination
   * @returns {Promise<Array>} - Array of matching records
   */
  async query(table, filters = {}, options = {}) {
    const { page = 1, pageSize = 10, orderBy, orderDirection } = options;
    
    // Build query parameters
    const params = {
      ...buildPaginationParams(page, pageSize),
      filter: filters
    };
    
    // Add sorting if specified
    if (orderBy) {
      params.order_by = orderBy;
      if (orderDirection) {
        params.order_direction = orderDirection;
      }
    }
    
    return this.get(`/tables/${table}/rows`, params);
  }

  /**
   * Execute custom SQL query
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} - Query results
   */
  async executeQuery(query, params = []) {
    return this.post('/execute-query', { query, params });
  }

  /**
   * Count records matching criteria
   * @param {string} table - Table name
   * @param {Object} filters - Filter criteria
   * @returns {Promise<number>} - Count of matching records
   */
  async count(table, filters = {}) {
    const params = { count_only: true, filter: filters };
    const result = await this.get(`/tables/${table}/rows`, params);
    return result.count || 0;
  }
}

// Create an instance of the API client
export const rowsApi = new RowsApi();

export default rowsApi;