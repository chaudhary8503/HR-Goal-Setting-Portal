/**
 * Application Configuration
 * 
 * This file centralizes all configuration settings for the application.
 * It handles different environments and provides fallback values.
 */

// Environment detection
const isProd = import.meta.env.PROD || import.meta.env.MODE === 'production';
const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

// API URL configuration
// - For local development: uses http://localhost:5000
// - For production: uses VITE_API_BASE_URL environment variable (set in Railway/Vercel)
const getApiBaseUrl = () => {
  // In production, use environment variable if set, otherwise fallback to localhost
  if (isProd) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }
  // In development, always use localhost
  return 'http://localhost:5000';
};

export const config = {
  // API URLs
  api: {
    baseUrl: getApiBaseUrl()
  },

  // Authentication
  auth: {
    tokenKey: 'okr_auth_token',
  },
  
  // Feature flags
  features: {
    enableFallback: true,
  }
};

// Export individual configs for convenience
export const API_BASE_URL = config.api.baseUrl;
