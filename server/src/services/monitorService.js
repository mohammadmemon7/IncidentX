const axios = require('axios');

/**
 * Performs an HTTP GET check on a URL.
 * @param {string} url - The URL to check.
 * @returns {Promise<object>} - Results of the check.
 */
const performCheck = async (url) => {
  const start = Date.now();
  try {
    const response = await axios.get(url, { 
      timeout: 10000,
      validateStatus: (status) => true // Don't throw on error status codes
    });
    
    const responseTime = Date.now() - start;
    const success = response.status >= 200 && response.status < 300;

    return {
      success,
      statusCode: response.status,
      responseTime,
      error: success ? null : `HTTP Error: ${response.status}`
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      success: false,
      statusCode: error.response?.status || 0,
      responseTime,
      error: error.message
    };
  }
};

module.exports = { performCheck };
