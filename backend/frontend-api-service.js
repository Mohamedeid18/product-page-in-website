// API Configuration and Service Functions for React Frontend
// Place this file in: src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// ==================== AUTH API ====================

export const authAPI = {
    // Register new user
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Login user
    login: async (credentials) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        // Save token to localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!getAuthToken();
    },
};

// ==================== USERS API ====================

export const usersAPI = {
    // Get current user profile
    getProfile: async () => {
        return apiRequest('/users/me');
    },

    // Get all users (Admin only)
    getAllUsers: async () => {
        return apiRequest('/users');
    },

    // Get user by ID
    getUserById: async (userId) => {
        return apiRequest(`/users/${userId}`);
    },

    // Update user
    updateUser: async (userId, userData) => {
        return apiRequest(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    // Delete user (Admin only)
    deleteUser: async (userId) => {
        return apiRequest(`/users/${userId}`, {
            method: 'DELETE',
        });
    },
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
    // Get all products
    getAllProducts: async () => {
        return apiRequest('/products');
    },

    // Get product by ID
    getProductById: async (productId) => {
        return apiRequest(`/products/${productId}`);
    },

    // Create product (Admin only)
    createProduct: async (productData) => {
        return apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    // Update product (Admin only)
    updateProduct: async (productId, productData) => {
        return apiRequest(`/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    // Delete product (Admin only)
    deleteProduct: async (productId) => {
        return apiRequest(`/products/${productId}`, {
            method: 'DELETE',
        });
    },
};

// ==================== ORDERS API ====================

export const ordersAPI = {
    // Create order (Client only)
    createOrder: async (orderData) => {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Get all orders
    getAllOrders: async () => {
        return apiRequest('/orders');
    },

    // Get order by ID
    getOrderById: async (orderId) => {
        return apiRequest(`/orders/${orderId}`);
    },

    // Update order status (Admin only)
    updateOrderStatus: async (orderId, status) => {
        return apiRequest(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    // Rate order (Client only)
    rateOrder: async (orderId, rating, review) => {
        return apiRequest(`/orders/${orderId}/rate`, {
            method: 'POST',
            body: JSON.stringify({ rating, review }),
        });
    },
};

// Export all APIs
export default {
    auth: authAPI,
    users: usersAPI,
    products: productsAPI,
    orders: ordersAPI,
};
