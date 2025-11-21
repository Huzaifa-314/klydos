const API_BASE_URL = 'http://localhost/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
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

  // Campaign Service Endpoints (Future - placeholder)
  campaigns: {
    // List all campaigns
    list: async (params = {}) => {
      // TODO: Replace with actual API when available
      // const queryString = new URLSearchParams(params).toString();
      // const response = await fetch(`${API_BASE_URL}/campaigns?${queryString}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // return handleResponse(response);
      throw new Error('Campaign service not yet available');
    },

    // Get campaign by ID
    getById: async (id) => {
      // TODO: Replace with actual API when available
      // const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // return handleResponse(response);
      throw new Error('Campaign service not yet available');
    },
  },

  // Pledge Service Endpoints (Future - placeholder)
  pledges: {
    // Create pledge
    create: async (campaignId, pledgeData) => {
      // TODO: Replace with actual API when available
      // const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/pledge`, {
      //   method: 'POST',
      //   headers: getAuthHeaders(),
      //   body: JSON.stringify(pledgeData),
      // });
      // return handleResponse(response);
      throw new Error('Pledge service not yet available');
    },
  },
};

// Export token management functions
export { getAuthToken, setAuthToken };

