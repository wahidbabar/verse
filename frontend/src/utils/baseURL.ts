// src/config/baseUrl.ts
const getBaseUrl = () => {
  // Check if we're in a production environment
  const isProduction = import.meta.env.VITE_DEV_ENVIRONMENT === "production";

  // Different base URLs for development and production
  if (isProduction) {
    return "https://verse-backend-h9kh.onrender.com";
  } else {
    return "http://localhost:5000";
  }
};

export default getBaseUrl;
