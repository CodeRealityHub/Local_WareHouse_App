import api from '../api/api';

// ==========================================
// GET ALL SALES ORDERS
// GET /api/sales-orders
// ==========================================

export const getSalesOrders = async () => {
  try {
    const response = await api.get('/sales-orders');
    return response.data;
  } catch (error) {
    console.error(
      'GET SALES ORDERS ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// GET SINGLE SALES ORDER
// GET /api/sales-orders/:id
// ==========================================

export const getSalesOrderById = async (id) => {
  try {
    const response = await api.get(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'GET SALES ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// CREATE SALES ORDER
// POST /api/sales-orders
// ==========================================

export const createSalesOrder = async (data) => {
  try {
    const response = await api.post('/sales-orders', data);
    return response.data;
  } catch (error) {
    console.error(
      'CREATE SALES ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// UPDATE SALES ORDER
// PUT /api/sales-orders/:id
// ==========================================

export const updateSalesOrder = async (id, data) => {
  try {
    const response = await api.put(`/sales-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(
      'UPDATE SALES ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// ==========================================
// DELETE SALES ORDER
// DELETE /api/sales-orders/:id
// ==========================================

export const deleteSalesOrder = async (id) => {
  try {
    const response = await api.delete(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'DELETE SALES ORDER ERROR:',
      error.response?.data || error.message,
    );
    throw error;
  }
};