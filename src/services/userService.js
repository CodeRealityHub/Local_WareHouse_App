import api from '../api/api';

// ==========================================
// GET USER PROFILE
// GET /api/users/profile
// ==========================================

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error(
      'GET USER PROFILE ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// UPDATE USER PROFILE
// PUT /api/users/profile
// ==========================================

export const updateUserProfile = async (data) => {
  try {
    const response = await api.put('/users/profile', data);
    return response.data;
  } catch (error) {
    console.error(
      'UPDATE USER PROFILE ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// GET ALL USERS (Admin)
// GET /api/users
// ==========================================

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error(
      'GET ALL USERS ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};