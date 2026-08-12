import api from '../api/api';

// ==========================================
// GET ALL INVENTORY MOVEMENTS
// GET /api/inventory
// ==========================================

export const getInventory = async () => {
  try {
    const response = await api.get('/inventory');

    return response.data;
  } catch (error) {
    console.error(
      'Get inventory error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// GET SINGLE INVENTORY MOVEMENT
// GET /api/inventory/:id
// ==========================================

export const getInventoryById = async id => {
  try {
    const response = await api.get(`/inventory/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      'Get inventory by ID error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// CREATE INVENTORY MOVEMENT
// POST /api/inventory
// ==========================================

export const createInventory = async inventoryData => {
  try {
    const response = await api.post(
      '/inventory',
      inventoryData,
    );

    return response.data;
  } catch (error) {
    console.error(
      'Create inventory error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// UPDATE INVENTORY MOVEMENT
// PUT /api/inventory/:id
// ==========================================

export const updateInventory = async (
  id,
  inventoryData,
) => {
  try {
    const response = await api.put(
      `/inventory/${id}`,
      inventoryData,
    );

    return response.data;
  } catch (error) {
    console.error(
      'Update inventory error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// ==========================================
// DELETE INVENTORY MOVEMENT
// DELETE /api/inventory/:id
// ==========================================

export const deleteInventory = async id => {
  try {
    const response = await api.delete(
      `/inventory/${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(
      'Delete inventory error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};