import API from "@/lib/api";

// API สำหรับอัปเดตข้อมูลผู้ใช้
export const updateUserAPI = async (userId, userData) => {
  try {
    const response = await API.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// API สำหรับลบผู้ใช้
export const deleteUserAPI = async (userId) => {
  try {
    const response = await API.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// API สำหรับสร้างผู้ใช้ใหม่
export const createUserAPI = async (userData) => {
  try {
    const response = await API.post("/user", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// API สำหรับรับข้อมูลผู้ใช้ตาม ID
export const getUserByIdAPI = async (userId) => {
  try {
    const response = await API.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
