import api from '../api/api';

// ==========================================
// GET SUPPLIERS
// ==========================================
export const getSuppliers = async () => {
  try {
    const response = await api.get('/suppliers'); // Ensure this matches your backend route (e.g., /suppliers or /supplier)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// CREATE SUPPLIER
// ==========================================
export const createSupplier = async (data) => {
  try {
    const response = await api.post('/suppliers', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// UPDATE SUPPLIER
// ==========================================
export const updateSupplier = async (id, data) => {
  try {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// DELETE SUPPLIER
// ==========================================
export const deleteSupplier = async (id) => {
  try {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};