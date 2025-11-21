// Admin Session Management with Secure Handling

const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_API_KEY_KEY = 'adminApiKey';
const ADMIN_SESSION_EXPIRY_KEY = 'adminSessionExpiry';
const ADMIN_LAST_ACTIVITY_KEY = 'adminLastActivity';

// Session expires after 1 hour of inactivity (3600000 ms)
const SESSION_TIMEOUT = 60 * 60 * 1000;

/**
 * Store admin session data
 */
export const setAdminSession = (token, apiKey, expiresIn = SESSION_TIMEOUT) => {
  const now = Date.now();
  const expiry = now + expiresIn;
  
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_API_KEY_KEY, apiKey);
  localStorage.setItem(ADMIN_SESSION_EXPIRY_KEY, expiry.toString());
  localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, now.toString());
};

/**
 * Get admin token
 */
export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/**
 * Get admin API key
 */
export const getAdminApiKey = () => {
  return localStorage.getItem(ADMIN_API_KEY_KEY);
};

/**
 * Check if admin session is valid
 */
export const isAdminSessionValid = () => {
  const token = getAdminToken();
  const apiKey = getAdminApiKey();
  const expiry = localStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);
  const lastActivity = localStorage.getItem(ADMIN_LAST_ACTIVITY_KEY);

  if (!token || !apiKey || !expiry || !lastActivity) {
    return false;
  }

  const now = Date.now();
  const expiryTime = parseInt(expiry, 10);
  const lastActivityTime = parseInt(lastActivity, 10);

  // Check if session has expired
  if (now > expiryTime) {
    clearAdminSession();
    return false;
  }

  // Check if inactive for too long (1 hour)
  if (now - lastActivityTime > SESSION_TIMEOUT) {
    clearAdminSession();
    return false;
  }

  return true;
};

/**
 * Update last activity timestamp
 */
export const updateAdminActivity = () => {
  if (isAdminSessionValid()) {
    localStorage.setItem(ADMIN_LAST_ACTIVITY_KEY, Date.now().toString());
    return true;
  }
  return false;
};

/**
 * Clear admin session
 */
export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_API_KEY_KEY);
  localStorage.removeItem(ADMIN_SESSION_EXPIRY_KEY);
  localStorage.removeItem(ADMIN_LAST_ACTIVITY_KEY);
};

/**
 * Get remaining session time in milliseconds
 */
export const getRemainingSessionTime = () => {
  const expiry = localStorage.getItem(ADMIN_SESSION_EXPIRY_KEY);
  if (!expiry) {
    return 0;
  }
  const expiryTime = parseInt(expiry, 10);
  const now = Date.now();
  return Math.max(0, expiryTime - now);
};

/**
 * Setup activity tracking for admin pages
 * Call this in admin components to track user activity
 */
export const setupAdminActivityTracking = () => {
  // Update activity on user interactions
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  
  const updateActivity = () => {
    updateAdminActivity();
  };

  events.forEach((event) => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  // Return cleanup function
  return () => {
    events.forEach((event) => {
      document.removeEventListener(event, updateActivity);
    });
  };
};

/**
 * Setup session expiration warning
 * Shows warning when session is about to expire (5 minutes before)
 */
export const setupSessionExpirationWarning = (onExpiring, onExpired) => {
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiry
  
  const checkExpiration = () => {
    if (!isAdminSessionValid()) {
      if (onExpired) {
        onExpired();
      }
      return;
    }

    const remaining = getRemainingSessionTime();
    
    if (remaining > 0 && remaining <= WARNING_TIME && remaining > WARNING_TIME - 1000) {
      // Show warning only once when entering warning zone
      if (onExpiring) {
        onExpiring(Math.floor(remaining / 1000 / 60)); // minutes remaining
      }
    }
  };

  // Check every minute
  const interval = setInterval(checkExpiration, 60 * 1000);
  checkExpiration(); // Initial check

  return () => clearInterval(interval);
};

