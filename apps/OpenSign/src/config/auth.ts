// Authentication configuration
export const AUTH_CONFIG = {
  // Google OAuth Client ID - Replace with your actual client ID
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
  
  // Parse Server configuration
  PARSE_APP_ID: "signia",
  PARSE_SERVER_URL: "https://opensign-production-ee42.up.railway.app/parse",
  PARSE_MASTER_KEY: "signia_master_key_2024",
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
