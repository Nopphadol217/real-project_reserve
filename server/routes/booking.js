const express = require("express");
const { createBooking } = require("../controllers/booking");
const { checkout } = require("../controllers/booking");
const { checkOutStatus } = require("../controllers/booking");
const { listBookings } = require("../controllers/booking");
const { authCheck } = require("../middleware/authCheck");
const router = express.Router();

// @ENDPOINT http://localhost:5000/api/bookings
router.get("/bookings", authCheck, listBookings);

// @ENDPOINT http://localhost:5000/api/booking
router.post("/booking", authCheck, createBooking);

// @PAYMENT
// @ENDPOINT http://localhost:5000/api/checkout
router.post("/checkout", authCheck, checkout);

// @PAYMENT Status
// @ENDPOINT http://localhost:5000/api/checkout-status/:session_id
router.get("/checkout-status/:session_id", authCheck, checkOutStatus);

module.exports = router;
