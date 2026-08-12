import api from '../api/api';

// ==========================================
// CUSTOMER SERVICE
// ==========================================

// GET ALL CUSTOMERS
export const getCustomers = async () => {
  const response = await api.get('/customer');

  return response.data;
};

// GET SINGLE CUSTOMER
export const getCustomerById = async id => {
  const response = await api.get(`/customer/${id}`);

  return response.data;
};

// CREATE CUSTOMER
export const createCustomer = async customerData => {
  const response = await api.post(
    '/customer',
    customerData,
  );

  return response.data;
};

// UPDATE CUSTOMER
export const updateCustomer = async (
  id,
  customerData,
) => {
  const response = await api.put(
    `/customer/${id}`,
    customerData,
  );

  return response.data;
};

// DELETE CUSTOMER
export const deleteCustomer = async id => {
  const response = await api.delete(
    `/customer/${id}`,
  );

  return response.data;
};