// Configuration file for the Asset Management System
export const config = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5051/api',
    timeout: 10000,
  },
  
  // App Configuration
  app: {
    name: 'Asset Management System',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    enableNotifications: true,
    enableAnalytics: false,
  }
};
