'use client';

import React from 'react';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Đang tải...' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        {/* Logo xoay tròn */}
        <div className={`${sizeClasses[size]} animate-spin`}>
          <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-blue-600"></div>
        </div>
        
        {/* Logo web ở giữa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/logo.jfif"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Text loading */}
      <p className="mt-4 text-gray-600 text-sm font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
