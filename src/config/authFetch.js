// ===================================================================
// Zayed Uddin Frontend - Authenticated Fetch Utility
// Wrapper around fetch that handles 401 (Unauthorized) responses
// by clearing auth data and redirecting to login page.
// ===================================================================

import { API_BASE_URL } from './api';

/**
 * Make an authenticated API call.
 * Automatically attaches the Bearer token from localStorage.
 * If the server responds with 401 (Unauthorized), auth data is cleared
 * and the user is redirected to the login page.
 *
 * @param {string} url - The URL to fetch (can be full URL or path like '/blogs')
 * @param {RequestInit} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    // Build headers with authorization
    const headers = {
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // If body is not FormData, set Content-Type
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If 401 Unauthorized, clear auth and dispatch event for ProtectedRoute
    if (response.status === 401) {
        // Dispatch custom event that ProtectedRoute listens for
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
    }

    return response;
};

export default authFetch;
