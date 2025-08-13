import api from "@/lib/api";

// Get all users
export const getAllUsersAPI = async () => {
  return await api.get("/admin/users");
};

// Get pending business applications
export const getPendingBusinessAPI = async () => {
  return await api.get("/admin/pending-business");
};

// Get user by ID
export const getUserByIdAPI = async (userId) => {
  return await api.get(`/admin/users/${userId}`);
};

// Approve business user
export const approveBusinessUserAPI = async (userId) => {
  return await api.put(`/admin/users/${userId}/approve`);
};

// Reject business user
export const rejectBusinessUserAPI = async (userId, reason) => {
  return await api.put(`/admin/users/${userId}/reject`, { reason });
};

// Update user role
export const updateUserRoleAPI = async (userId, role) => {
  return await api.put(`/admin/users/${userId}/role`, { role });
};

// Delete user
export const deleteUserAPI = async (userId) => {
  return await api.delete(`/admin/users/${userId}`);
};
