const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { authCheck, adminCheck } = require("../middleware/authCheck");

const prisma = new PrismaClient();

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ admin)
router.get("/", authCheck, adminCheck, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        enabled: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
    });
  }
});

// GET - ดึงข้อมูลผู้ใช้ตาม ID
router.get("/:id", authCheck, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        enabled: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }

    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
    });
  }
});

// PUT - อัปเดตข้อมูลผู้ใช้
router.put("/:id", authCheck, adminCheck, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, role, enabled } = req.body;

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่ (ถ้ามีการเปลี่ยนอีเมล)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email },
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "อีเมลนี้มีผู้ใช้งานแล้ว",
        });
      }
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(email && { email }),
        ...(role && { role }),
        ...(enabled !== undefined && { enabled }),
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        enabled: true,
      },
    });

    res.json({
      success: true,
      message: "อัปเดตข้อมูลผู้ใช้สำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้",
    });
  }
});

// DELETE - ลบผู้ใช้ (soft delete)
router.delete("/:id", authCheck, adminCheck, async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }

    // ป้องกันการลบ admin คนสุดท้าย
    if (existingUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN", enabled: true },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้",
        });
      }
    }

    // Soft delete - ปิดการใช้งานบัญชี
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { enabled: false },
    });

    res.json({
      success: true,
      message: "ปิดการใช้งานบัญชีผู้ใช้สำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบผู้ใช้",
    });
  }
});

// POST - เปิดใช้งานบัญชีผู้ใช้อีกครั้ง
router.post("/:id/enable", authCheck, adminCheck, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { enabled: true },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        enabled: true,
      },
    });

    res.json({
      success: true,
      message: "เปิดใช้งานบัญชีผู้ใช้สำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error enabling user:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเปิดใช้งานบัญชีผู้ใช้",
    });
  }
});

module.exports = router;
