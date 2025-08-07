const prisma = require("../config/prisma");

// ตรวจสอบห้องว่าง
const checkRoomAvailability = async (req, res) => {
  try {
    const { placeId, checkIn, checkOut, roomId } = req.query;

    if (!placeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลให้ครบถ้วน",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // ตรวจสอบวันที่
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "วันที่เช็คอินต้องก่อนวันที่เช็คเอาท์",
      });
    }

    // หาการจองที่ทับซ้อนกับช่วงวันที่ที่ต้องการ
    let whereCondition = {
      status: {
        in: ["confirmed", "pending"], // เปลี่ยนเป็น lowercase
      },
      OR: [
        {
          // การจองที่เริ่มก่อนหรือในช่วงที่ต้องการ และสิ้นสุดหลังวันเช็คอิน
          checkIn: {
            lte: checkOutDate,
          },
          checkOut: {
            gt: checkInDate,
          },
        },
      ],
    };

    // ถ้าระบุ roomId ให้ตรวจสอบเฉพาะห้องนั้น มิเช่นนั้นตรวจสอบทั้ง place
    if (roomId) {
      whereCondition.roomId = parseInt(roomId);
    } else {
      whereCondition.placeId = parseInt(placeId);
    }

    const conflictingBookings = await prisma.booking.findMany({
      where: whereCondition,
      include: {
        Room: true, // เปลี่ยนเป็น uppercase
      },
    });

    // หาห้องทั้งหมดของที่พักนี้
    const allRooms = await prisma.room.findMany({
      // เปลี่ยนจาก roomDetail เป็น room
      where: {
        placeId: parseInt(placeId),
        ...(roomId && { id: parseInt(roomId) }),
      },
    });

    // คำนวณห้องที่ว่าง (ต้องดูทั้งการจองและสถานะห้อง)
    const bookedRoomIds = conflictingBookings.map((booking) => booking.roomId);

    const availableRooms = allRooms.filter(
      (room) => !bookedRoomIds.includes(room.id) && !room.status // ห้องว่าง (status = false)
    );

    const isAvailable = availableRooms.length > 0;
    const totalRooms = allRooms.length;
    const bookedRooms = bookedRoomIds.length;
    const occupiedRooms = allRooms.filter((room) => room.status).length; // ห้องที่ไม่ว่าง

    res.json({
      success: true,
      data: {
        isAvailable,
        availableRooms,
        totalRooms,
        bookedRooms,
        occupiedRooms,
        availableCount: availableRooms.length,
        conflictingBookings: conflictingBookings.length,
        roomStatus: {
          total: totalRooms,
          available: availableRooms.length,
          booked: bookedRooms,
          occupied: occupiedRooms,
        },
      },
    });
  } catch (error) {
    console.error("Check room availability error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบห้องว่าง",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ตรวจสอบห้องว่างสำหรับหลายห้อง
const checkMultipleRoomsAvailability = async (req, res) => {
  try {
    const { placeId, checkIn, checkOut } = req.query;

    if (!placeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุข้อมูลให้ครบถ้วน",
      });
    }

    // หาห้องทั้งหมด
    const allRooms = await prisma.room.findMany({
      // เปลี่ยนจาก roomDetail เป็น room
      where: {
        placeId: parseInt(placeId),
      },
    });

    // ตรวจสอบแต่ละห้อง
    const roomAvailability = await Promise.all(
      allRooms.map(async (room) => {
        const conflictingBookings = await prisma.booking.findMany({
          where: {
            placeId: parseInt(placeId),
            status: {
              in: ["confirmed", "pending"], // เปลี่ยนเป็น lowercase
            },
            roomId: room.id, // เปลี่ยนจาก roomDetails เป็น roomId
            OR: [
              {
                checkIn: {
                  lte: new Date(checkOut),
                },
                checkOut: {
                  gt: new Date(checkIn),
                },
              },
            ],
          },
        });

        // ห้องจะว่างได้ต้องไม่มีการจอง และสถานะห้องเป็นว่าง (status = false)
        const isAvailable = conflictingBookings.length === 0 && !room.status;

        return {
          ...room,
          isAvailable,
          conflictingBookings: conflictingBookings.length,
          roomStatus: room.status ? "occupied" : "available",
        };
      })
    );

    const availableRooms = roomAvailability.filter((room) => room.isAvailable);

    res.json({
      success: true,
      data: {
        rooms: roomAvailability,
        availableRooms,
        totalRooms: allRooms.length,
        availableCount: availableRooms.length,
        hasAvailableRooms: availableRooms.length > 0,
      },
    });
  } catch (error) {
    console.error("Check multiple rooms availability error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบห้องว่าง",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  checkRoomAvailability,
  checkMultipleRoomsAvailability,
};
