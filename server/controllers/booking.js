const renderError = require("../utils/renderError");
const prisma = require("../config/prisma");
const { calTotal } = require("../utils/booking");
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.listBookings = async (req, res, next) => {
  //แสดง list ที่ จองไว้ แสดงสถานะจ่ายแล้ว
  try {
    const { id } = req.user;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: id,
        status: "confirmed",
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
        checkIn: "asc",
      },
    });

    res.json({ result: bookings, message: "Your bookings" });
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

    // 4 calculate total destructoring แปลงวันที่ ดึง ราคารวม และวันที่จองทั้งหมด
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
      // Update booking status
      const updatedBooking = await prisma.booking.update({
        where: {
          id: parseInt(bookingId),
        },
        data: {
          status: "confirmed",
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
