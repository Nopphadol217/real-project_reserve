const express = require("express");
const router = express.Router();
const {
  checkRoomAvailability,
  checkMultipleRoomsAvailability,
} = require("../controllers/availability");

// GET /api/availability/check - ตรวจสอบห้องว่าง
router.get("/check", checkRoomAvailability);

// GET /api/availability/rooms - ตรวจสอบห้องว่างทั้งหมด
router.get("/rooms", checkMultipleRoomsAvailability);

module.exports = router;
