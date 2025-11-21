// Admin Session Management

const ADMIN_TOKEN_KEY = 'adminToken';

/**
 * Store admin session token
 */
export const setAdminSession = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

/**
 * Get admin token
 */
export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/**
 * Check if admin session exists (no expiration check)
 */
export const isAdminSessionValid = () => {
  const token = getAdminToken();
  return !!token; // Simply check if token exists
};

/**
 * Clear admin session
 */
export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};
