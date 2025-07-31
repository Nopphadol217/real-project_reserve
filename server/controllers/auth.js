const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const renderError = require("../utils/renderError");
const prisma = require("../config/prisma");

exports.register = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;
    const existedUser = await prisma.user.findUnique({ where: { email } });
    if (existedUser) {
      return renderError(400, "มี email นี้ในระบบแล้ว");
    }
    //  Verify Password
    if (password !== confirmPassword) {
      return renderError(401, "รหัสผ่านไม่ตรงกัน");
    }
    if (!email || !username || !password || !confirmPassword) {
      return renderError(400, "กรุณากรอกข้อมูลให้ครบถ้วน");
    }

    // brycpt
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        role: "USER",
      },
    });

    res.status(200).json({ result: user, message: "Register SuccessFully!" });
    console.log(req.body);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return renderError(400, "invaild credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return renderError(400, "Invalid credentials");
    }
    const isAdmin = user.role === "ADMIN";
    const tokenAge = isAdmin ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000; // 7 วัน หรือ 15 นาที // ADMIN 7 DAY , USER 15 M.
    // Create JWT
    // Access token (15 นาที)
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: tokenAge }
    );

    // Refresh token (7 วัน)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: tokenAge }
    );

    // เขียน cookie แยก
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: tokenAge, // 15 นาที
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: tokenAge, // 7 วัน
    });

    res.json({
      message: "Login SuccessFully!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  const { email, username, picture, googleId, firstname, lastname } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email: email } });

    if (user) {
      // ถ้ายังไม่ผูก GoogleId → ทำการ update
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email: email },
          data: {
            googleId: googleId,
            firstname: firstname,
            lastname: lastname,
            picture: picture,
          },
        });
      } else {
        // ถ้ามี GoogleId แล้ว จะอัปเดต firstname และ lastname
        user = await prisma.user.update({
          where: { email: email },
          data: {
            firstname: firstname || user.firstname, // ถ้า firstname ใหม่มีค่า ให้ใช้ แต่ถ้าไม่มีก็ใช้ค่าเดิม
            lastname: lastname || user.lastname, // ถ้า lastname ใหม่มีค่า ให้ใช้ แต่ถ้าไม่มีก็ใช้ค่าเดิม
            picture: picture || user.picture, // อัปเดตภาพโปรไฟล์ถ้ามี
          },
        });
      }
    } else {
      // ผู้ใช้ยังไม่มีข้อมูลในฐานข้อมูล → สร้างผู้ใช้ใหม่
      user = await prisma.user.create({
        data: {
          email,
          username: email.split("@")[0], // สร้าง username จาก email
          googleId,
          firstname,
          lastname,
          picture,
          password: "", // ไม่ต้องใช้ password
        },
      });
    }

    const isAdmin = user.role === "ADMIN";
    const tokenAge = isAdmin ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000; // 7 วัน หรือ 30 นาที

    // Access token (15 นาที)
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: tokenAge }
    );

    // Refresh token (7 วัน)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: tokenAge }
    );

    // เขียน cookie แยก
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: tokenAge, // 15 นาที
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: tokenAge, // 7 วัน
    });
    res.json({
      message: "Login SuccessFully!",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return renderError(401, "No refresh token");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return renderError(401, "User not found");

    const isAdmin = user.role === "ADMIN";
    const refreshAge = isAdmin ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 วัน หรือ 1 วัน
    // ออก access token ใหม่
    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: refreshAge }
    );

    // สร้าง access token ใหม่
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: refreshAge, // 15 นาที
    });

    res.json({
      message: "Token refreshed",
    });
    next();
  } catch (error) {
    return renderError(403, "Invalid or expired refresh token");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, password, currentPassword } = req.body;
    const userId = req.user.id;

    // ค้นหาผู้ใช้ปัจจุบัน
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // เตรียมข้อมูลที่จะอัปเดต
    const updateData = {};

    // อัปเดต username (ถ้ามี)
    if (username && username !== user.username) {
      // ตรวจสอบว่า username ใหม่ซ้ำกับคนอื่นหรือไม่
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
      }

      updateData.username = username;
    }

    // อัปเดต password (ถ้ามี)
    if (password) {
      // ตรวจสอบว่าเป็น Google User ที่ยังไม่มีรหัสผ่านหรือไม่
      const isGoogleUserWithoutPassword =
        user.googleId && (!user.password || user.password === "");

      if (isGoogleUserWithoutPassword) {
        // สำหรับ Google User ที่ยังไม่มีรหัสผ่าน - สามารถตั้งรหัสผ่านใหม่ได้เลย
        console.log("Google User กำลังตั้งรหัสผ่านใหม่");
      } else {
        // สำหรับ Regular User หรือ Google User ที่มีรหัสผ่านแล้ว ต้องใส่รหัสผ่านเดิม
        if (!currentPassword) {
          return res.status(400).json({ message: "กรุณาใส่รหัสผ่านปัจจุบัน" });
        }

        const isValidPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isValidPassword) {
          return res
            .status(400)
            .json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
        }
      }

      // เข้ารหัสรหัสผ่านใหม่
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    // ถ้าไม่มีข้อมูลที่จะอัปเดต
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "ไม่มีข้อมูลที่เปลี่ยนแปลง" });
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "อัปเดตข้อมูลสำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return renderError(500, "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์");
  }
};
