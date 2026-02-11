import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  color = 'blue',
  text
}) => {
  // Size mapping
  const sizeMap = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  // Color mapping
  const colorMap = {
    blue: 'border-blue-500 border-t-blue-200',
    white: 'border-white border-t-gray-200',
    gray: 'border-gray-600 border-t-gray-200'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeMap[size]} ${colorMap[color]} rounded-full animate-spin`}
        style={{ borderTopColor: 'transparent' }}
      />
      {text && (
        <p className="mt-2 text-sm text-slate-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
