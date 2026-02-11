import axios from 'axios';
import { generateFallbackGoals } from './fallback';
import { API_BASE_URL, config } from '@/config';

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    email: string;
    name?: string;
    role?: string;
  };
  message?: string;
  error?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

/**
 * Authenticate user and get token
 * @param credentials User login credentials
 * @returns Promise with login response
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log("Attempting to login with credentials:", credentials);
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 seconds timeout
    });    // Store token in localStorage for persistent auth
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      localStorage.setItem(config.auth.tokenKey, response.data.token);
    }

    console.log('Login successful for the user :', response.data.user.email);
    return {
      success: true,
      token: response.data.token,
      user: response.data.user
    };
  } catch (error: any) {
    console.error('Login error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to authenticate'
    };
  }
};

/**
 * Register a new user
 * @param credentials User registration data
 * @returns Promise with registration response
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000 // 10 seconds timeout
    });

    return {
      success: true,
      message: response.data.message,
      user: response.data.user
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register user'
    };
  }
};

/**
 * Logout user and clear token
 */
export const logoutUser = (): void => {
  localStorage.removeItem(config.auth.tokenKey);
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(config.auth.tokenKey);
};

/**
 * Get the current auth token
 * @returns The authentication token or null
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(config.auth.tokenKey);
};

/**
 * Add auth token to request headers
 * @returns Headers object with authorization token
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};
