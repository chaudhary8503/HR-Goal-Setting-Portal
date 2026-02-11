import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import {ApiStatusProps} from '@/types/api'; // Assuming you have a types file for ApiStatusProps
import { API_BASE_URL } from '@/config';




const ApiStatus: React.FC<ApiStatusProps> = ({ 
  apiUrl, 
  pollingInterval = 30000 // Default: check every 30 seconds
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const baseUrl = apiUrl || API_BASE_URL;

  const checkConnection = async () => {
    try {
      await axios.get(`${baseUrl}/api/health`, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setIsConnected(true);
    } catch (error) {
      console.error('API health check failed:', error);
      setIsConnected(false);
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Check connection immediately on mount
    checkConnection();

    // Set up polling interval
    const intervalId = setInterval(checkConnection, pollingInterval);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [baseUrl, pollingInterval]);

  if (isConnected === null) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <AlertCircle size={14} className="mr-1" />
        Checking API connection...
      </div>
    );
  }

  return (
    <div className={`flex items-center text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      {isConnected ? (
        <>
          <CheckCircle size={14} className="mr-1" />
          <Wifi size={14} className="mr-1" />
          Connected to API
        </>
      ) : (
        <>
          <WifiOff size={14} className="mr-1" />
          API Unavailable
          {lastChecked && (
            <span className="ml-2 text-xs text-gray-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default ApiStatus;
