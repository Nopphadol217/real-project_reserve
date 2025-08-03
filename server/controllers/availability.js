const prisma = require('../config/prisma');

// ตรวจสอบห้องว่าง
const checkRoomAvailability = async (req, res) => {
  try {
    const { placeId, checkIn, checkOut, roomId } = req.query;

    if (!placeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // ตรวจสอบวันที่
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'วันที่เช็คอินต้องก่อนวันที่เช็คเอาท์'
      });
    }

    // หาการจองที่ทับซ้อนกับช่วงวันที่ที่ต้องการ
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        placeId: parseInt(placeId),
        status: {
          in: ['CONFIRMED', 'PENDING'] // เฉพาะการจองที่ยืนยันแล้วหรือรอยืนยัน
        },
        OR: [
          {
            // การจองที่เริ่มก่อนหรือในช่วงที่ต้องการ และสิ้นสุดหลังวันเช็คอิน
            checkIn: {
              lte: checkOutDate
            },
            checkOut: {
              gt: checkInDate
            }
          }
        ],
        ...(roomId && {
          roomDetails: {
            some: {
              id: parseInt(roomId)
            }
          }
        })
      },
      include: {
        roomDetails: true
      }
    });

    // หาห้องทั้งหมดของที่พักนี้
    const allRooms = await prisma.roomDetail.findMany({
      where: {
        placeId: parseInt(placeId),
        ...(roomId && { id: parseInt(roomId) })
      }
    });

    // คำนวณห้องที่ว่าง
    const bookedRoomIds = conflictingBookings.flatMap(booking => 
      booking.roomDetails.map(room => room.id)
    );

    const availableRooms = allRooms.filter(room => 
      !bookedRoomIds.includes(room.id)
    );

    const isAvailable = availableRooms.length > 0;
    const totalRooms = allRooms.length;
    const bookedRooms = bookedRoomIds.length;

    res.json({
      success: true,
      data: {
        isAvailable,
        availableRooms,
        totalRooms,
        bookedRooms,
        availableCount: availableRooms.length,
        conflictingBookings: conflictingBookings.length
      }
    });

  } catch (error) {
    console.error('Check room availability error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบห้องว่าง',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'กรุณาระบุข้อมูลให้ครบถ้วน'
      });
    }

    // หาห้องทั้งหมด
    const allRooms = await prisma.roomDetail.findMany({
      where: {
        placeId: parseInt(placeId)
      }
    });

    // ตรวจสอบแต่ละห้อง
    const roomAvailability = await Promise.all(
      allRooms.map(async (room) => {
        const conflictingBookings = await prisma.booking.findMany({
          where: {
            placeId: parseInt(placeId),
            status: {
              in: ['CONFIRMED', 'PENDING']
            },
            roomDetails: {
              some: {
                id: room.id
              }
            },
            OR: [
              {
                checkIn: {
                  lte: new Date(checkOut)
                },
                checkOut: {
                  gt: new Date(checkIn)
                }
              }
            ]
          }
        });

        return {
          ...room,
          isAvailable: conflictingBookings.length === 0,
          conflictingBookings: conflictingBookings.length
        };
      })
    );

    const availableRooms = roomAvailability.filter(room => room.isAvailable);

    res.json({
      success: true,
      data: {
        rooms: roomAvailability,
        availableRooms,
        totalRooms: allRooms.length,
        availableCount: availableRooms.length,
        hasAvailableRooms: availableRooms.length > 0
      }
    });

  } catch (error) {
    console.error('Check multiple rooms availability error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบห้องว่าง',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  checkRoomAvailability,
  checkMultipleRoomsAvailability
};
