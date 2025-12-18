/**
 * Utility functions for handling API responses
 */

/**
 * Extracts data from various API response structures
 * Handles: { data: { data: { data: [] }}}, { data: { data: [] }}, { data: [] }
 */
export const extractData = (response, defaultValue = []) => {
    try {
        if (response?.data?.data?.data) {
            const data = response.data.data.data;
            return Array.isArray(data) ? data : defaultValue;
        }
        if (response?.data?.data) {
            const data = response.data.data;
            return Array.isArray(data) ? data : defaultValue;
        }
        if (response?.data) {
            const data = response.data;
            return Array.isArray(data) ? data : defaultValue;
        }
        return defaultValue;
    } catch (error) {
        console.error('Error extracting data:', error);
        return defaultValue;
    }
};

/**
 * Extracts pagination info from API response
 */
export const extractPagination = (response) => {
    try {
        const data = response?.data?.data || response?.data || {};
        return {
            currentPage: data.current_page || 1,
            lastPage: data.last_page || 1,
            perPage: data.per_page || 15,
            total: data.total || 0,
            from: data.from || 0,
            to: data.to || 0
        };
    } catch (error) {
        console.error('Error extracting pagination:', error);
        return { currentPage: 1, lastPage: 1, perPage: 15, total: 0, from: 0, to: 0 };
    }
};

/**
 * Extracts a single item from API response
 */
export const extractItem = (response, defaultValue = null) => {
    try {
        if (response?.data?.data) return response.data.data;
        if (response?.data) return response.data;
        return defaultValue;
    } catch (error) {
        console.error('Error extracting item:', error);
        return defaultValue;
    }
};

/**
 * Safely gets a nested property from an object
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
    try {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? defaultValue;
    } catch (error) {
        return defaultValue;
    }
};

/**
 * Format error message from API error response
 */
export const formatApiError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.response?.data?.error) {
        return error.response.data.error;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

export default {
    extractData,
    extractPagination,
    extractItem,
    getNestedValue,
    formatApiError
};
