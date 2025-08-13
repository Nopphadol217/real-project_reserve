const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  approveBusinessUser,
  rejectBusinessUser,
  updateUserRole,
  deleteUser,
  getPendingBusinessApplications,
} = require("../controllers/admin");
const { authCheck } = require("../middleware/authCheck");

// Middleware to check admin role
const adminCheck = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "ไม่มีสิทธิ์เข้าถึง",
    });
  }
  next();
};

// Get all users
router.get("/admin/users", authCheck, adminCheck, getAllUsers);

// Get pending business applications
router.get(
  "/admin/pending-business",
  authCheck,
  adminCheck,
  getPendingBusinessApplications
);

// Get user by ID
router.get("/admin/users/:userId", authCheck, adminCheck, getUserById);

// Approve business user
router.put(
  "/admin/users/:userId/approve",
  authCheck,
  adminCheck,
  approveBusinessUser
);

// Reject business user
router.put(
  "/admin/users/:userId/reject",
  authCheck,
  adminCheck,
  rejectBusinessUser
);

// Update user role
router.put("/admin/users/:userId/role", authCheck, adminCheck, updateUserRole);

// Delete user
router.delete("/admin/users/:userId", authCheck, adminCheck, deleteUser);

module.exports = router;
