/**
 * API Configuration
 * Cấu hình kết nối đến backend server
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_PREFIX: '/api',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}/${cleanEndpoint}`;
}

