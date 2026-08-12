import api from '../api/api';

// ==========================================
// GET ALL PURCHASE ORDERS
// GET /api/purchase-orders
// ==========================================

export const getPurchaseOrders = async () => {
  try {
    const response = await api.get('/purchase-orders'); // Check if singular or plural matches your backend
    return response.data;
  } catch (error) {
    console.error(
      'GET PURCHASE ORDERS ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// GET SINGLE PURCHASE ORDER
// GET /api/purchase-orders/:id
// ==========================================

export const getPurchaseOrderById = async (id) => {
  try {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'GET PURCHASE ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// CREATE PURCHASE ORDER
// POST /api/purchase-orders
// ==========================================

export const createPurchaseOrder = async (data) => {
  try {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  } catch (error) {
    console.error(
      'CREATE PURCHASE ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// UPDATE PURCHASE ORDER
// PUT /api/purchase-orders/:id
// ==========================================

export const updatePurchaseOrder = async (id, data) => {
  try {
    const response = await api.put(`/purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      'UPDATE PURCHASE ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// DELETE PURCHASE ORDER
// DELETE /api/purchase-orders/:id
// ==========================================

export const deletePurchaseOrder = async (id) => {
  try {
    const response = await api.delete(`/purchase-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'DELETE PURCHASE ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};