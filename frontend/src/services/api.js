const API_BASE_URL = 'http://localhost/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || errorMessage;
    } catch (e) {
      // If response is not JSON, try to get text
      try {
        const text = await response.text();
        errorMessage = text || errorMessage;
      } catch (e2) {
        // Keep default error message
      }
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  
  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return null;
  }
  
  try {
    return await response.json();
  } catch (e) {
    // If response is not JSON, return text or empty object
    const text = await response.text();
    return text ? { message: text } : {};
  }
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Get admin auth headers (uses admin token + API key if needed)
const getAdminAuthHeaders = async () => {
  const { getAdminToken } = await import('../utils/adminSession');
  const adminToken = getAdminToken();
  
  // Note: According to implementation, admin endpoints require X-API-Key
  // For now, we'll use admin token. Backend should validate admin role from token
  // If backend requires X-API-Key, it should be stored server-side or provided via env
  return {
    'Content-Type': 'application/json',
    ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
    // TODO: Add X-API-Key header if backend requires it
    // 'X-API-Key': process.env.REACT_APP_ADMIN_API_KEY || '',
  };
};

// API Service
export const api = {
  // User Service Endpoints
  users: {
    // Register User
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });
      return handleResponse(response);
    },

    // Login User
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);
      // Store token
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    // Get Current User
    getCurrentUser: async () => {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Get User by ID
    getUserById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    },

    // Logout User
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      await handleResponse(response);
      // Remove token
      setAuthToken(null);
    },
  },

  // Campaign Service Endpoints
  campaigns: {
    // List all campaigns (public)
    list: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.featured !== undefined) queryParams.append('featured', params.featured);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/campaigns${queryString ? `?${queryString}` : ''}`;
        
        console.log('[API] Fetching campaigns from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('[API] Response status:', response.status, response.statusText);
        
        const data = await handleResponse(response);
        console.log('[API] Campaigns data received:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.campaigns)) {
          return data.campaigns;
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        }
        
        return data || [];
      } catch (error) {
        console.error('[API] Campaigns list error:', error);
        console.error('[API] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        throw error;
      }
    },

    // Get campaign by ID (public)
    getById: async (id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return await handleResponse(response);
      } catch (error) {
        console.error('[API] Get campaign by ID error:', error);
        throw error;
      }
    },

    // Create campaign (admin only)
    create: async (campaignData) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers,
        body: JSON.stringify(campaignData),
      });
      return handleResponse(response);
    },

    // Update campaign (admin only)
    update: async (id, campaignData) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(campaignData),
      });
      return handleResponse(response);
    },

    // Update campaign status (admin only)
    updateStatus: async (id, status) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    // Upload campaign photos (admin only)
    uploadPhotos: async (id, photos) => {
      const { getAdminToken } = await import('../utils/adminSession');
      const adminToken = getAdminToken();
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      
      const headers = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      // Note: Don't set Content-Type for FormData, browser will set it with boundary
      
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/photos`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return handleResponse(response);
    },
  },

  // Pledge Service Endpoints
  pledges: {
    // Create pledge for a campaign
    create: async (campaignId, pledgeData) => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/pledge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(), // Include auth token if user is logged in
          },
          body: JSON.stringify({
            amount: pledgeData.amount,
            user_id: pledgeData.user_id || null, // Optional - null for guest donations
          }),
        });
        return await handleResponse(response);
      } catch (error) {
        console.error('[API] Create pledge error:', error);
        throw error;
      }
    },

    // Get pledges by user ID (if endpoint exists)
    getByUserId: async (userId) => {
      try {
        // Note: This endpoint may not exist yet in Pledge Service
        // If it doesn't exist, this will return an error and we'll handle it gracefully
        const response = await fetch(`${API_BASE_URL}/pledges/user/${userId}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return await handleResponse(response);
      } catch (error) {
        console.error('[API] Get pledges by user error:', error);
        // Return empty array if endpoint doesn't exist
        if (error.status === 404) {
          return [];
        }
        throw error;
      }
    },

    // Get all pledges (admin only - if endpoint exists)
    list: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();
        if (params.campaign_id) queryParams.append('campaign_id', params.campaign_id);
        if (params.user_id) queryParams.append('user_id', params.user_id);
        if (params.status) queryParams.append('status', params.status);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        const queryString = queryParams.toString();
        const url = `${API_BASE_URL}/pledges${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return await handleResponse(response);
      } catch (error) {
        console.error('[API] List pledges error:', error);
        // Return empty array if endpoint doesn't exist
        if (error.status === 404) {
          return [];
        }
        throw error;
      }
    },

    // Get pledge by ID
    getById: async (pledgeId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/pledges/${pledgeId}`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return await handleResponse(response);
      } catch (error) {
        console.error('[API] Get pledge by ID error:', error);
        throw error;
      }
    },
  },

  // Admin Service Endpoints
  admin: {
    // Admin Login (email + password only)
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await handleResponse(response);
      // Store admin token if provided
      if (data.token) {
        const { setAdminSession } = await import('../utils/adminSession');
        setAdminSession(data.token);
      }
      return data;
    },

    // Verify Admin Session
    verifySession: async () => {
      const { getAdminToken } = await import('../utils/adminSession');
      const adminToken = getAdminToken();
      if (!adminToken) {
        throw new Error('No admin session found');
      }
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/verify-session`, {
        method: 'GET',
        headers,
      });
      return handleResponse(response);
    },

    // Admin Logout
    logout: async () => {
      const { clearAdminSession } = await import('../utils/adminSession');
      try {
        const headers = await getAdminAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers,
        });
        await handleResponse(response);
      } catch (error) {
        console.error('Admin logout error:', error);
      } finally {
        clearAdminSession();
      }
    },

    // Get admin metrics
    getMetrics: async () => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/admin/metrics`, {
        method: 'GET',
        headers,
      });
      return handleResponse(response);
    },

    // Campaign Management (Admin endpoints use /api/campaigns with admin auth)
    getCampaigns: async (params = {}) => {
      // Use regular campaigns endpoint - admin can see all campaigns
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/campaigns?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    },

    createCampaign: async (campaignData) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns`, {
        method: 'POST',
        headers,
        body: JSON.stringify(campaignData),
      });
      return handleResponse(response);
    },

    updateCampaign: async (id, campaignData) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(campaignData),
      });
      return handleResponse(response);
    },

    updateCampaignStatus: async (id, status) => {
      const headers = await getAdminAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    uploadCampaignPhotos: async (id, photos) => {
      const { getAdminToken } = await import('../utils/adminSession');
      const adminToken = getAdminToken();
      const formData = new FormData();
      photos.forEach((photo) => {
        formData.append('photos', photo);
      });
      
      const headers = {};
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      // Note: Don't set Content-Type for FormData, browser will set it with boundary
      
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}/photos`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return handleResponse(response);
    },

    // Donations Management
    getDonations: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/donations?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    processRefund: async (donationId, refundData) => {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/refund`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(refundData),
      });
      return handleResponse(response);
    },

    resendReceipt: async (donationId) => {
      const response = await fetch(`${API_BASE_URL}/admin/donations/${donationId}/receipt`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Users Management
    getUsers: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/users?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    blockUser: async (userId, blocked) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ blocked }),
      });
      return handleResponse(response);
    },

    promoteToOrganizer: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/promote`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    resetPassword: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Webhooks
    getWebhooks: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/webhooks?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    retryWebhook: async (webhookId) => {
      const response = await fetch(`${API_BASE_URL}/admin/webhooks/${webhookId}/retry`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Refunds
    getRefunds: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/refunds?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    processRefund: async (refundId) => {
      const response = await fetch(`${API_BASE_URL}/admin/refunds/${refundId}/process`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Audit Logs
    getAuditLogs: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/audit-logs?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Notifications
    sendAnnouncement: async (announcementData) => {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/announcement`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(announcementData),
      });
      return handleResponse(response);
    },

    // Settings
    getSettings: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    updateSettings: async (settingsData) => {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData),
      });
      return handleResponse(response);
    },

    // Support Tickets
    getSupportTickets: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/support-tickets?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    replyToTicket: async (ticketId, replyData) => {
      const response = await fetch(`${API_BASE_URL}/admin/support-tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(replyData),
      });
      return handleResponse(response);
    },

    // Reports
    generateReport: async (reportType, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/admin/reports/${reportType}?${queryString}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    // Roles & Access
    getAdmins: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },

    addAdmin: async (adminData) => {
      const response = await fetch(`${API_BASE_URL}/admin/admins`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(adminData),
      });
      return handleResponse(response);
    },

    removeAdmin: async (adminId) => {
      const response = await fetch(`${API_BASE_URL}/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    },
  },
};

// Export token management functions
export { getAuthToken, setAuthToken };

// Export api as default for convenience
export default api;

