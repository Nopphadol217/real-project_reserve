const renderError = require("../utils/renderError");
const prisma = require("../config/prisma");
const { calTotal } = require("../utils/booking");
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.listBookings = async (req, res, next) => {
  //แสดง list ที่ จองไว้ แสดงสถานะทั้งหมด
  try {
    const { id } = req.user;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: id,
      },
      include: {
        Place: {
          select: {
            id: true,
            title: true,
            secure_url: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      bookings: bookings,
      message: "Your bookings",
    });
  } catch (error) {
    next(error);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    //step 1 destructoring req.body
    const { userId, placeId, roomId, checkIn, checkOut } = req.body;

    console.log("Create booking request body:", req.body);

    //step 2 delete Booking
    await prisma.booking.deleteMany({
      where: {
        userId: userId,
        status: "pending",
      },
    });

    //step 3 find place หา id place เลือกราคา
    const place = await prisma.place.findFirst({
      where: {
        id: parseInt(placeId),
      },
      include: {
        roomDetails: true,
      },
    });

    if (!place) {
      return renderError(res, 400, "Place Not Found");
    }

    let pricePerNight = place.price;
    let selectedRoom = null;
    let finalRoomId = null;

    // ถ้าเลือกห้องเฉพาะ
    if (roomId) {
      selectedRoom = place.roomDetails.find(
        (room) => room.id === parseInt(roomId)
      );
      if (selectedRoom) {
        pricePerNight = selectedRoom.price;
        finalRoomId = parseInt(roomId);
      }
    } else if (place.roomDetails.length > 0) {
      // ถ้าไม่ได้เลือกห้อง แต่มีห้องอยู่ ให้เลือกห้องแรก
      selectedRoom = place.roomDetails[0];
      pricePerNight = selectedRoom.price;
      finalRoomId = selectedRoom.id;
    }

    // ตรวจสอบความถูกต้องของวันที่
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถจองย้อนหลังได้",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "วันที่ออกต้องมากกว่าวันที่เข้าพัก",
      });
    }

    // ตรวจสอบการจองที่ซ้ำซ้อนสำหรับห้องนี้เฉพาะ (ยกเว้น user นี้)
    const conflictBookings = await prisma.booking.findMany({
      where: {
        roomId: finalRoomId,
        userId: {
          not: parseInt(userId), // ไม่รวม user ที่กำลังจอง
        },
        AND: [
          {
            checkIn: {
              lt: checkOutDate,
            },
          },
          {
            checkOut: {
              gt: checkInDate,
            },
          },
        ],
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    if (conflictBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "ห้องที่เลือกถูกจองแล้วในช่วงวันที่ดังกล่าว",
        conflictBookings: conflictBookings.map((b) => ({
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
        })),
      });
    } // 4 calculate total destructoring แปลงวันที่ ดึง ราคารวม และวันที่จองทั้งหมด
    const { total, totalNight } = calTotal(pricePerNight, checkIn, checkOut);

    // 5 insert to db บันทึกลง DataBase
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        placeId: parseInt(placeId),
        roomId: finalRoomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice: total,
        status: "pending",
      },
    });

    console.log("Booking created:", booking);
    const bookingId = booking.id;

    // 6 send id booking to react
    res.json({ message: "Booking Successfully", result: bookingId });
  } catch (error) {
    console.error("Create booking error:", error);
    next(error);
  }
};

// Create booking for bank transfer payment
exports.createBankTransferBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { placeId, checkIn, checkOut, totalPrice, roomId } = req.body;

    console.log("Create bank transfer booking:", req.body);

    // ตรวจสอบว่า place มีอยู่จริง
    const place = await prisma.place.findUnique({
      where: { id: parseInt(placeId) },
      include: {
        roomDetails: true,
      },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบที่พักที่เลือก",
      });
    }

    // ตรวจสอบความถูกต้องของวันที่
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถจองย้อนหลังได้",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "วันที่ออกต้องมากกว่าวันที่เข้าพัก",
      });
    }

    // ตรวจสอบการจองที่ซ้ำซ้อนสำหรับห้องนี้เฉพาะ
    const conflictBookings = await prisma.booking.findMany({
      where: {
        roomId: parseInt(roomId), // ตรวจสอบเฉพาะห้องที่เลือก
        AND: [
          {
            checkIn: {
              lt: checkOutDate,
            },
          },
          {
            checkOut: {
              gt: checkInDate,
            },
          },
        ],
        status: {
          in: ["pending", "confirmed"],
        },
      },
    });

    console.log("Conflict bookings found:", conflictBookings.length);
    console.log("Checking dates:", {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      conflictBookings: conflictBookings.map((b) => ({
        id: b.id,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        status: b.status,
      })),
    });

    if (conflictBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "วันที่เลือกถูกจองแล้ว",
        conflictBookings: conflictBookings.map((b) => ({
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status,
        })),
      });
    }

    // หาห้องที่เหมาะสม
    let finalRoomId = null;
    if (roomId) {
      const selectedRoom = place.roomDetails.find(
        (room) => room.id === parseInt(roomId)
      );
      if (selectedRoom) {
        finalRoomId = parseInt(roomId);
      }
    } else if (place.roomDetails.length > 0) {
      finalRoomId = place.roomDetails[0].id;
    }

    if (!finalRoomId && place.roomDetails.length > 0) {
      return res.status(400).json({
        success: false,
        message: "ไม่พบห้องที่เลือก",
      });
    }

    // สร้าง booking ใหม่
    const booking = await prisma.booking.create({
      data: {
        userId: parseInt(userId),
        placeId: parseInt(placeId),
        roomId: finalRoomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice: parseInt(totalPrice),
        status: "pending",
        paymentStatus: "unpaid",
      },
      include: {
        Place: {
          select: {
            id: true,
            title: true,
            secure_url: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "สร้างการจองสำเร็จ",
      data: booking,
    });
  } catch (error) {
    console.error("Create bank transfer booking error:", error);
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("Checkout request body:", req.body);
    console.log("Booking ID:", id);

    // step 1 find booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        Place: {
          select: {
            id: true,
            secure_url: true,
            title: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("Found booking:", booking);

    if (!booking) {
      console.log("Booking not found for ID:", id);
      return renderError(res, 404, "Booking Not Found");
    }

    // ดึงข้อมูล DB มา destructor เอาไปแสดง
    const { totalPrice, checkIn, checkOut, Place, Room } = booking;
    const { secure_url, title } = Place;

    // สร้าง product name
    let productName = title;
    if (Room) {
      productName += ` - ${Room.name}`;
    }

    // คำนวณจำนวนคืน
    const totalNights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );

    console.log("Creating Stripe session with:", {
      totalPrice,
      totalNights,
      productName,
      bookingId: booking.id,
    });

    // step 2 stripe
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      metadata: { bookingId: booking.id },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "thb",
            product_data: {
              name: productName,
              images: [secure_url],
              description: `เช็คอิน: ${checkIn.toLocaleDateString()} - เช็คเอาท์: ${checkOut.toLocaleDateString()} (${totalNights} คืน)`,
            },
            unit_amount: totalPrice * 100,
          },
        },
      ],
      mode: "payment",
      return_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/user/complete/{CHECKOUT_SESSION_ID}`,
    });

    console.log("Stripe session created:", session.id);
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Checkout error:", error);
    next(error);
  }
};

exports.checkOutStatus = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const bookingId = session.metadata?.bookingId;

    // Check
    if (session.status !== "complete" || !bookingId) {
      return renderError(res, 400, "Something Wrong!!!");
    }

    console.log("Updating booking ID:", bookingId);

    // Get booking details first
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
      },
      include: {
        Room: true,
        Place: true,
      },
    });

    if (!booking) {
      return renderError(res, 400, "Booking not found");
    }

    // Update DB Status with transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update booking status and payment status
      const updatedBooking = await prisma.booking.update({
        where: {
          id: parseInt(bookingId),
        },
        data: {
          status: "confirmed",
          paymentStatus: "paid", // Update payment status to paid for Stripe payments
        },
        include: {
          Room: true,
          Place: true,
        },
      });

      // Update room status to unavailable if room exists
      if (booking.roomId) {
        await prisma.room.update({
          where: {
            id: booking.roomId,
          },
          data: {
            status: true, // true = booked/unavailable
          },
        });
      }

      return updatedBooking;
    });

    res.json({
      message: "Payment Complete",
      status: session.status,
      booking: result,
    });
  } catch (error) {
    console.error("Checkout status error:", error);
    next(error);
  }
};

// Clear all bookings for a specific room
exports.clearRoomBookings = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return renderError(res, 400, "Room ID is required");
    }

    console.log(`Clearing bookings for room ${roomId}`);

    // Find all confirmed bookings for this room
    const roomBookings = await prisma.booking.findMany({
      where: {
        roomId: parseInt(roomId),
        status: "confirmed",
      },
      include: {
        Room: true,
        Place: true,
      },
    });

    console.log(`Found ${roomBookings.length} bookings to clear`);

    if (roomBookings.length === 0) {
      return res.json({
        message: "No active bookings found for this room",
        deletedCount: 0,
      });
    }

    // Delete all confirmed bookings for this room
    const deleteResult = await prisma.booking.deleteMany({
      where: {
        roomId: parseInt(roomId),
        status: "confirmed",
      },
    });

    console.log(`Deleted ${deleteResult.count} bookings for room ${roomId}`);

    res.json({
      message: `Successfully cleared ${deleteResult.count} bookings for room`,
      deletedCount: deleteResult.count,
      deletedBookings: roomBookings,
    });
  } catch (error) {
    console.error("Clear room bookings error:", error);
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบการจองที่ต้องการยกเลิก",
      });
    }

    // Check if booking can be cancelled (only pending/unpaid bookings)
    if (
      booking.paymentStatus !== "pending" &&
      booking.paymentStatus !== "unpaid"
    ) {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถยกเลิกการจองที่ชำระเงินแล้ว",
      });
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: {
        id: parseInt(bookingId),
      },
      data: {
        status: "cancelled",
        paymentStatus: "cancelled",
      },
    });

    res.json({
      success: true,
      message: "ยกเลิกการจองสำเร็จ",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    next(error);
  }
};

// Get all bookings with payment status for MyOrders page
exports.getAllBookingsWithPayment = async (req, res, next) => {
  try {
    const { id } = req.user;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: id,
        paymentStatus: "paid",
      },
      include: {
        Place: {
          select: {
            id: true,
            title: true,
            secure_url: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total statistics
    const totalOrders = bookings.length;
    const totalNights = bookings.reduce((sum, booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return sum + nights;
    }, 0);
    const totalAmount = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    res.json({
      success: true,
      bookings,
      statistics: {
        totalOrders,
        totalNights,
        totalAmount,
      },
      message: "Paid bookings retrieved successfully",
    });
  } catch (error) {
    console.error("Get paid bookings error:", error);
    next(error);
  }
};

// Process automatic checkout for bookings that have passed checkout date
exports.processAutomaticCheckout = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(12, 0, 0, 0); // เช็คเวลา 12:00 น.

    // หา bookings ที่ checkout date ผ่านไปแล้วแต่ยังเป็น confirmed
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        checkOut: {
          lt: today,
        },
      },
      include: {
        Room: true,
        Place: true,
      },
    });

    if (expiredBookings.length === 0) {
      return res.json({
        success: true,
        message: "ไม่มีการจองที่ต้อง checkout",
        processedCount: 0,
      });
    }

    // Process each expired booking
    const results = await Promise.all(
      expiredBookings.map(async (booking) => {
        try {
          // อัปเดตสถานะการจองเป็น completed
          const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "completed" },
          });

          // อัปเดตสถานะห้องให้ว่างสำหรับวันที่ checkout แล้ว
          await prisma.availability.updateMany({
            where: {
              roomId: booking.roomId,
              date: {
                gte: booking.checkIn,
                lt: booking.checkOut,
              },
            },
            data: {
              isAvailable: true, // ห้องว่างแล้ว
            },
          });

          return {
            bookingId: booking.id,
            success: true,
            message: "Checkout completed",
          };
        } catch (error) {
          console.error(`Error processing booking ${booking.id}:`, error);
          return {
            bookingId: booking.id,
            success: false,
            message: error.message,
          };
        }
      })
    );

    res.json({
      success: true,
      message: `ประมวลผล checkout สำเร็จ ${
        results.filter((r) => r.success).length
      } รายการ`,
      processedCount: results.filter((r) => r.success).length,
      results,
    });
  } catch (error) {
    console.error("Process automatic checkout error:", error);
    next(error);
  }
};

// Manual checkout function for admin
exports.manualCheckout = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId) },
      include: { Room: true, Place: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบการจอง",
      });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "การจองนี้ไม่สามารถ checkout ได้",
      });
    }

    // อัปเดตสถานะการจองเป็น completed
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: { status: "completed" },
      include: {
        Room: true,
        Place: true,
        User: true,
      },
    });

    // อัปเดตสถานะห้องให้ว่าง (status = false = ว่าง)
    await prisma.room.update({
      where: { id: booking.roomId },
      data: {
        status: false, // false = ว่าง, true = จองแล้ว
      },
    });

    res.json({
      success: true,
      message: "Checkout สำเร็จ ห้องพร้อมให้บริการแล้ว",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Manual checkout error:", error);
    next(error);
  }
};
