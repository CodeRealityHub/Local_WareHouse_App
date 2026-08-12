import api from '../api/api';

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};      

export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Profile Error:", error.response?.data || error.message);
    throw error;
  }
};