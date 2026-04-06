const isDev = import.meta.env.MODE === "development";

export const API_URL = isDev
  ? "https://blog-backend-j816.onrender.com/api/v1"      // development
  : "https://blog-backend-j816.onrender.com/api/v1";     // production