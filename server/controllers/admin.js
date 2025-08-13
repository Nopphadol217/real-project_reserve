const express = require("express");
const prisma = require("../config/prisma");
const renderError = require("../utils/renderError");

// Get all users for admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        businessInfo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        businessInfo: true,
      },
    });

    if (!user) {
      return renderError(404, "ไม่พบผู้ใช้");
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
};

// Approve business user
exports.approveBusinessUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { businessInfo: true },
    });

    if (!user) {
      return renderError(404, "ไม่พบผู้ใช้");
    }

    if (user.role !== "PENDING_BUSINESS") {
      return renderError(400, "ผู้ใช้นี้ไม่ได้รอการอนุมัติ");
    }

    // Update user role to BUSINESS
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        role: "BUSINESS",
        businessInfo: {
          update: {
            status: "APPROVED",
          },
        },
      },
      include: {
        businessInfo: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "อนุมัติผู้ประกอบการเรียบร้อย",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error approving business user:", error);
    next(error);
  }
};

// Reject business user
exports.rejectBusinessUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: { businessInfo: true },
    });

    if (!user) {
      return renderError(404, "ไม่พบผู้ใช้");
    }

    if (user.role !== "PENDING_BUSINESS") {
      return renderError(400, "ผู้ใช้นี้ไม่ได้รอการอนุมัติ");
    }

    // Update user role to USER and mark business info as rejected
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        role: "USER",
        businessInfo: {
          update: {
            status: "REJECTED",
            rejectedAt: new Date(),
            rejectedReason: reason || "ไม่ระบุเหตุผล",
          },
        },
      },
      include: {
        businessInfo: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "ปฏิเสธคำขอผู้ประกอบการเรียบร้อย",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error rejecting business user:", error);
    next(error);
  }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["USER", "BUSINESS", "ADMIN"];
    if (!validRoles.includes(role)) {
      return renderError(400, "ประเภทผู้ใช้ไม่ถูกต้อง");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      include: {
        businessInfo: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตประเภทผู้ใช้เรียบร้อย",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return renderError(404, "ไม่พบผู้ใช้");
    }

    // Don't allow deleting admin users
    if (user.role === "ADMIN") {
      return renderError(403, "ไม่สามารถลบผู้ดูแลระบบได้");
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    res.status(200).json({
      success: true,
      message: "ลบผู้ใช้เรียบร้อย",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    next(error);
  }
};

// Get pending business applications
exports.getPendingBusinessApplications = async (req, res, next) => {
  try {
    const pendingUsers = await prisma.user.findMany({
      where: {
        role: "PENDING_BUSINESS",
      },
      include: {
        businessInfo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      users: pendingUsers,
      count: pendingUsers.length,
    });
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    next(error);
  }
};
