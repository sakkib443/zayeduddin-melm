// ===================================================================
// Zayed Uddin Frontend - API Configuration
// API URL centralized export
// ===================================================================

/**
 * Centered API Configuration
 * If environment variable is not found, it falls back to the production URL.
 * NEVER hardcode localhost:5000 in components.
 */
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://hiictpark-server.vercel.app/api';

// For legacy code support (if any file uses API_URL specifically)
export const API_URL = API_BASE_URL;

console.log('🔌 API Base URL:', API_BASE_URL);

// Local development reminder:
// Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:5000/api
