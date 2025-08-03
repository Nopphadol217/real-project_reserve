const prisma = require("../config/prisma");
const renderError = require("../utils/renderError");

// Get room availability
exports.getRoomAvailability = async (req, res, next) => {
  try {
    const { placeId } = req.params;
    const { checkIn, checkOut } = req.query;

    const place = await prisma.place.findFirst({
      where: {
        id: parseInt(placeId),
      },
      include: {
        roomDetails: {
          include: {
            bookings: {
              where: {
                status: "confirmed",
                OR: [
                  {
                    AND: [
                      { checkIn: { lte: new Date(checkIn) } },
                      { checkOut: { gt: new Date(checkIn) } },
                    ],
                  },
                  {
                    AND: [
                      { checkIn: { lt: new Date(checkOut) } },
                      { checkOut: { gte: new Date(checkOut) } },
                    ],
                  },
                  {
                    AND: [
                      { checkIn: { gte: new Date(checkIn) } },
                      { checkOut: { lte: new Date(checkOut) } },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    });

    if (!place) {
      return renderError(res, 404, "Place not found");
    }

    const roomsWithAvailability = place.roomDetails.map((room) => ({
      ...room,
      isAvailable: room.bookings.length === 0 && !room.status, // false = available, true = booked
      bookedDates: room.bookings.map((booking) => ({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
      })),
    }));

    res.json({
      success: true,
      place: {
        ...place,
        roomDetails: roomsWithAvailability,
      },
    });
  } catch (error) {
    console.error("Get room availability error:", error);
    next(error);
  }
};

// Get all room statuses for a place
exports.getAllRoomStatuses = async (req, res, next) => {
  try {
    const { placeId } = req.params;

    const rooms = await prisma.room.findMany({
      where: {
        placeId: parseInt(placeId),
      },
      include: {
        bookings: {
          where: {
            status: "confirmed",
            checkOut: {
              gte: new Date(), // Only future bookings
            },
          },
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
          },
        },
      },
    });

    const roomStatuses = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      price: room.price,
      status: room.status, // true = booked, false = available
      isCurrentlyBooked: room.status || room.bookings.length > 0,
      upcomingBookings: room.bookings,
    }));

    res.json({
      success: true,
      rooms: roomStatuses,
    });
  } catch (error) {
    console.error("Get room statuses error:", error);
    next(error);
  }
};
