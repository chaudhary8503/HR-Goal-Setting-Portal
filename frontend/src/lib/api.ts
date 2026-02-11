import axios from 'axios';
import { generateFallbackGoals } from './fallback';
import { OKRData } from '@/types';
import toast from 'react-hot-toast';
import { OutputGoalProps } from '@/types/index';
import { API_BASE_URL } from '@/config';

/**
 * Sends the OKR data to the backend and gets AI-generated SMART goals
 * @param data User's OKR form data
 * @param retryCount Number of retries in case of failure (default: 2)
 * @returns Promise containing the AI response
 */
export const generateSmartGoal = async (data: OKRData, retryCount = 2) => {try {
    const response = await axios.post(`${API_BASE_URL}/api/generate-smart-goals`, {
      goalDescription: data.goalDescription,
      dueDate: data.dueDate,
      department: data.department,
      jobTitle: data.jobTitle,
      startDate: data.startDate,
      keyResult: data.keyResult,
      managersGoal: data.managersGoal
    }, {
      timeout: 30000 // 30 seconds timeout for potentially slow AI responses
    });
    
    return {
      success: true,
      result: response.data
    };
  } catch (error: any) {
    console.error('Error generating SMART goal:', error);
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Request timed out. The server might be busy, please try again later.'
      };
    }
      if (!error.response) {
      // If the server is completely unreachable, use fallback data
      const fallbackData = generateFallbackGoals(data);
      console.log('Using fallback data due to server unreachability');
      return {
        success: true,
        result: fallbackData,
        isFallback: true
      };
    }
    
    if (error.response.status === 429) {
      return {
        success: false,
        error: 'Too many requests. Please try again later.'
      };
    }
      return {
      success: false,
      error: error.response?.data?.error || 'An error occurred while connecting to the server'
    };
  }
};


/**
 * Sends users goal to backend for saving it
 * @param goal User's goal data
 * @returns Promise containing the API response
 */
export const saveUserGoal = async (goal: OutputGoalProps) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/save-user-goal`, goal);
    return {
      success: true,
      result: response.data
    };
  } catch (error: any) {
    console.error('Error saving user goal:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred while connecting to the server'
    };
  }
};

/**
 * Sends the user comments the goal to backend for editing it 
 */
export const SendEdit = async (goal: OutputGoalProps, comment: string) => {
  try {

    const response = await axios.post(`${API_BASE_URL}/api/edit-user-goal`, {
      goal,
      comment
    });

    return {
      success: true,
      result: response.data
    };

  } catch (error: any) {
    console.error('Error editing user goal:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'An error occurred while connecting to the server'
    };
  }
};

/**
 * Retry the API call if it fails
 * @param fn Function to retry
 * @param retriesLeft Number of retries left
 * @param delay Delay between retries in ms
 * @returns Promise with the result of the function
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retriesLeft = 2,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft <= 0) {
      throw error;
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return retry(fn, retriesLeft - 1, delay * 2);
  }
};
