import api from '../api/api';

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getCategories = async () => {
  const response = await api.get('/category');

  return response.data;
};

// ==========================================
// GET CATEGORY BY ID
// ==========================================

export const getCategoryById = async id => {
  const response = await api.get(
    `/category/${id}`,
  );

  return response.data;
};

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async categoryData => {
  const response = await api.post(
    '/category',
    categoryData,
  );

  return response.data;
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (
  id,
  categoryData,
) => {
  const response = await api.put(
    `/category/${id}`,
    categoryData,
  );

  return response.data;
};

// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async id => {
  const response = await api.delete(
    `/category/${id}`,
  );

  return response.data;
};