const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;
exports.createPlace = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      lat,
      lng,
      mainImage,
      galleryImages,
      userId,
      rooms, // จำนวนห้อง
      amenities, // สิ่งอำนวยความสะดวก
      roomDetails, // รายละเอียดห้องแต่ละห้อง
      paymentInfo, // ข้อมูลการชำระเงิน
    } = req.body;
    console.log("req.body", req.body);

    // แปลง amenities array เป็น JSON string
    const amenitiesJson = amenities ? JSON.stringify(amenities) : null;

    // 1️⃣ สร้าง place ก่อน
    const place = await prisma.place.create({
      data: {
        title: title,
        description: description,
        price: price,
        category: category,
        lat: lat,
        lng: lng,
        public_id: mainImage.public_id,
        secure_url: mainImage.secure_url,
        rooms: rooms || roomDetails?.length || 1, // ใช้จำนวนห้องจริงจาก roomDetails
        amenities: amenitiesJson,
        userId: userId,
      },
    });

    // 2️⃣ สร้าง gallery หลายตัว
    if (galleryImages && galleryImages.length > 0) {
      const galleryData = galleryImages.map((img) => ({
        public_id: img.public_id,
        secure_url: img.secure_url,
        placeId: place.id,
      }));

      await prisma.gallery.createMany({
        data: galleryData,
      });
    }

    // 3️⃣ สร้างข้อมูลการชำระเงิน (ถ้ามี)
    if (
      paymentInfo &&
      paymentInfo.accountName &&
      paymentInfo.bankName &&
      paymentInfo.accountNumber
    ) {
      await prisma.payment.create({
        data: {
          accountName: paymentInfo.accountName,
          bankName: paymentInfo.bankName,
          accountNumber: paymentInfo.accountNumber,
          qrCodeUrl: paymentInfo.qrCodeUrl || null,
          qrCodePublicId: paymentInfo.qrCodePublicId || null,
          userId: userId,
          placeId: place.id,
        },
      });
    }

    // 4️⃣ สร้างรายละเอียดห้องแต่ละห้อง
    if (roomDetails && roomDetails.length > 0) {
      const roomData = roomDetails.map((room) => ({
        name: room.name,
        price: parseInt(room.price),
        placeId: place.id,
        status: false, // default เป็นว่าง
      }));

      await prisma.room.createMany({
        data: roomData,
      });
    }

    res.json({ message: "Create Place Successfully.", place });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.listPlace = async (req, res, next) => {
  const { id } = req.params;

  // Convert id to number if it's a valid number, otherwise set to null
  const userId = id && id !== "null" ? parseInt(id) : null;

  try {
    const places = await prisma.place.findMany({
      include: {
        galleries: {
          select: {
            placeId: true,
            secure_url: true,
            public_id: true,
          },
        },
        roomDetails: {
          select: {
            id: true,
            name: true,
            price: true,
            status: true,
          },
        },
        favorites: userId
          ? {
              where: { userId: userId },
              select: { id: true },
            }
          : false,
      },
    });
    // แปลง amenities JSON string กลับเป็น array
    const placesWithAmenities = places.map((place) => ({
      ...place,
      amenities: place.amenities ? JSON.parse(place.amenities) : [],
    }));
    const placeWithLikes = places.map((place) => ({
      ...place,
      isFavorite: userId ? place.favorites.length > 0 : false, // ตรวจสอบว่ามี favorite หรือไม่ (เฉพาะเมื่อมี userId)
    }));

    res.json({ result: placesWithAmenities, favorites: placeWithLikes });
  } catch (error) {
    next(error);
  }
};

exports.readPlace = async (req, res, next) => {
  try {
    const { id } = req.params;
    const place = await prisma.place.findFirst({
      where: { id: Number(id) },
      include: {
        galleries: {
          select: {
            secure_url: true,
            public_id: true,
            placeId: true,
          },
        },
        roomDetails: {
          select: {
            id: true,
            name: true,
            price: true,
            status: true,
          },
        },
      },
    });

    // แปลง amenities JSON string กลับเป็น array
    const placeWithAmenities = place
      ? {
          ...place,
          amenities: place.amenities ? JSON.parse(place.amenities) : [],
        }
      : null;

    res.json({ result: placeWithAmenities });
    console.log(id);
  } catch (error) {
    next(error);
  }
};

exports.updatePlace = async (req, res, next) => {
  const {
    title,
    description,
    price,
    category,
    lat,
    lng,
    mainImage,
    userId,
    rooms,
    amenities,
    roomDetails,
    galleryImages,
  } = req.body;
  const { id } = req.params;

  try {
    // แปลง amenities array เป็น JSON string
    const amenitiesJson = amenities ? JSON.stringify(amenities) : null;

    // 1. อัปเดตข้อมูลหลักของ place
    const place = await prisma.place.update({
      where: { id: Number(id) },
      data: {
        title,
        price,
        description,
        category,
        lat,
        lng,
        public_id: mainImage.public_id,
        secure_url: mainImage.secure_url,
        rooms: rooms || roomDetails?.length || 1,
        amenities: amenitiesJson,
        userId,
      },
    });

    // 2. ลบ gallery เดิมทั้งหมด
    await prisma.gallery.deleteMany({
      where: { placeId: Number(id) },
    });

    // 3. เพิ่มรูป gallery ใหม่
    if (galleryImages && galleryImages.length > 0) {
      const galleryData = galleryImages.map((img) => ({
        secure_url: img.secure_url,
        public_id: img.public_id,
        placeId: Number(id),
      }));

      await prisma.gallery.createMany({
        data: galleryData,
      });
    }

    // 4. จัดการข้อมูลห้อง (Safe Update)
    let bookedRoomIds = [];
    if (roomDetails && roomDetails.length > 0) {
      // ตรวจสอบห้องที่มี booking อยู่
      const roomsWithBookings = await prisma.booking.findMany({
        where: {
          placeId: Number(id),
          status: {
            in: ["pending", "confirmed"], // booking ที่ยังใช้งานอยู่ (ไม่รวม cancelled)
          },
        },
        select: {
          roomId: true,
        },
      });

      // ตรวจสอบห้องที่ booking ถูก cancel แล้ว เพื่ออัพเดทสถานะเป็นว่าง
      const cancelledBookingRooms = await prisma.booking.findMany({
        where: {
          placeId: Number(id),
          status: "cancelled",
        },
        select: {
          roomId: true,
        },
      });

      // อัพเดทสถานะห้องที่ booking ถูก cancel ให้เป็นว่าง
      if (cancelledBookingRooms.length > 0) {
        const cancelledRoomIds = cancelledBookingRooms.map(
          (booking) => booking.roomId
        );
        await prisma.room.updateMany({
          where: {
            id: {
              in: cancelledRoomIds,
            },
          },
          data: {
            status: false, // เปลี่ยนเป็นว่าง
          },
        });
        console.log(
          `Updated ${cancelledRoomIds.length} rooms to available status due to cancelled bookings`
        );
      }

      bookedRoomIds = roomsWithBookings.map((booking) => booking.roomId);

      // ลบเฉพาะห้องที่ไม่มี booking
      if (bookedRoomIds.length > 0) {
        // ลบเฉพาะห้องที่ไม่มี booking
        await prisma.room.deleteMany({
          where: {
            placeId: Number(id),
            id: {
              notIn: bookedRoomIds,
            },
          },
        });

        // อัพเดทห้องที่มี booking อยู่ (ถ้าข้อมูลตรงกัน)
        const existingRooms = await prisma.room.findMany({
          where: {
            placeId: Number(id),
            id: {
              in: bookedRoomIds,
            },
          },
        });

        for (const room of roomDetails) {
          const existingRoom = existingRooms.find(
            (r) =>
              r.name === room.name || (room.id && r.id === parseInt(room.id))
          );

          if (existingRoom) {
            // อัพเดทห้องที่มีอยู่
            await prisma.room.update({
              where: { id: existingRoom.id },
              data: {
                name: room.name,
                price: parseInt(room.price),
                status: Boolean(room.status), // อัพเดทสถานะห้องด้วย
              },
            });
          } else if (!room.id) {
            // เพิ่มห้องใหม่
            await prisma.room.create({
              data: {
                name: room.name,
                price: parseInt(room.price),
                placeId: Number(id),
                status: Boolean(room.status) || false, // เพิ่มสถานะห้อง
              },
            });
          }
        }
      } else {
        // ไม่มี booking เลย - ตรวจสอบอีกครั้งก่อนลบ
        const finalCheck = await prisma.booking.findMany({
          where: {
            placeId: Number(id),
            status: {
              in: ["pending", "confirmed", "completed"], // รวม completed ด้วย แต่ไม่รวม cancelled
            },
          },
          select: {
            roomId: true,
          },
        });

        // ตรวจสอบและอัพเดทห้องที่มี booking cancelled
        const cancelledCheck = await prisma.booking.findMany({
          where: {
            placeId: Number(id),
            status: "cancelled",
          },
          select: {
            roomId: true,
          },
        });

        if (cancelledCheck.length > 0) {
          const cancelledRoomIds = cancelledCheck.map(
            (booking) => booking.roomId
          );
          await prisma.room.updateMany({
            where: {
              id: {
                in: cancelledRoomIds,
              },
            },
            data: {
              status: false, // เปลี่ยนเป็นว่าง
            },
          });
          console.log(
            `Updated ${cancelledRoomIds.length} rooms to available status due to cancelled bookings`
          );
        }

        const finalBookedRoomIds = finalCheck.map((booking) => booking.roomId);

        if (finalBookedRoomIds.length > 0) {
          // มี booking อยู่จริง - ใช้วิธีการอัพเดทแบบปลอดภัย
          await prisma.room.deleteMany({
            where: {
              placeId: Number(id),
              id: {
                notIn: finalBookedRoomIds,
              },
            },
          });

          // อัพเดทและเพิ่มห้องใหม่
          for (const room of roomDetails) {
            const existingRoom = await prisma.room.findFirst({
              where: {
                placeId: Number(id),
                name: room.name,
              },
            });

            if (existingRoom) {
              // อัพเดทห้องที่มีอยู่
              await prisma.room.update({
                where: { id: existingRoom.id },
                data: {
                  name: room.name,
                  price: parseInt(room.price),
                  status: Boolean(room.status) || false,
                },
              });
            } else {
              // เพิ่มห้องใหม่
              await prisma.room.create({
                data: {
                  name: room.name,
                  price: parseInt(room.price),
                  placeId: Number(id),
                  status: Boolean(room.status) || false,
                },
              });
            }
          }
        } else {
          // แน่ใจว่าไม่มี booking - ลบและสร้างใหม่ได้
          await prisma.room.deleteMany({
            where: { placeId: Number(id) },
          });

          const roomData = roomDetails.map((room) => ({
            name: room.name,
            price: parseInt(room.price),
            placeId: Number(id),
            status: Boolean(room.status) || false,
          }));

          await prisma.room.createMany({
            data: roomData,
          });
        }
      }
    }

    // ดึงข้อมูลที่อัปเดตแล้วพร้อม relations
    const updatedPlace = await prisma.place.findFirst({
      where: { id: Number(id) },
      include: {
        galleries: true,
        roomDetails: true,
      },
    });

    // แปลง amenities JSON string กลับเป็น array
    const placeWithAmenities = updatedPlace
      ? {
          ...updatedPlace,
          amenities: updatedPlace.amenities
            ? JSON.parse(updatedPlace.amenities)
            : [],
        }
      : null;

    res.status(200).json({
      success: true,
      message: "Update Successfully",
      place: placeWithAmenities,
      warnings:
        bookedRoomIds?.length > 0
          ? [
              `มีห้อง ${bookedRoomIds.length} ห้องที่ไม่สามารถลบได้เนื่องจากมีการจองอยู่`,
            ]
          : [],
    });
  } catch (error) {
    console.error("Error updating place:", error);

    // Handle specific Prisma errors
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "ไม่สามารถลบห้องได้เนื่องจากมีการจองอยู่ กรุณาลองใหม่อีกครั้ง",
        error: "Foreign key constraint violation",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลที่ต้องการอัพเดท",
        error: "Record not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });

    next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  const { id } = req.params;
  const { force } = req.query;

  console.log(`DELETE request for place ${id}, force: ${force}`);
  console.log("req.body:", req.body);
  console.log("req.query:", req.query);

  try {
    // ตรวจสอบว่า place มีอยู่หรือไม่
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        galleries: true,
        roomDetails: true,
        bookings: {
          include: {
            User: true,
          },
        },
        payments: true, // Include payment records for QR codes
      },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบที่พักที่ต้องการลบ",
      });
    }

    console.log(
      `Found place: ${place.title}, total bookings: ${
        place.bookings?.length || 0
      }`
    );

    // ตรวจสอบว่ามี booking ที่ยังใช้งานอยู่หรือไม่
    const activeBookings = await prisma.booking.findMany({
      where: {
        placeId: Number(id),
        status: {
          in: ["pending", "confirmed"], // booking ที่ยังใช้งานอยู่
        },
      },
    });

    const activeBookingsCount = activeBookings ? activeBookings.length : 0;
    console.log(`Active bookings count: ${activeBookingsCount}`);

    if (activeBookingsCount > 0) {
      if (force === "true") {
        console.log(
          `Force deleting place ${id} with ${activeBookingsCount} active bookings`
        );
        // ดำเนินการลบต่อไป (จะลบ bookings ด้วย)
      } else {
        return res.status(400).json({
          success: false,
          message: `ไม่สามารถลบที่พักได้ เนื่องจากมีการจอง ${activeBookingsCount} รายการที่ยังใช้งานอยู่`,
          error: "Active bookings exist",
          activeBookingsCount: activeBookingsCount,
          suggestion:
            "ใช้ ?force=true เพื่อลบแบบบังคับ (จะลบการจองทั้งหมดด้วย)",
        });
      }
    }

    // ลบรูปภาพหลักออกจาก Cloudinary
    if (place.public_id) {
      try {
        await cloudinary.uploader.destroy(place.public_id);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting main image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    // ลบรูป Gallery ออกจาก Cloudinary
    for (const gallery of place.galleries) {
      if (gallery.public_id) {
        try {
          await cloudinary.uploader.destroy(gallery.public_id);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting gallery image from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    // ลบ Payment Slip images จาก Cloudinary (จาก booking records)
    for (const booking of place.bookings) {
      if (booking.paymentSlip) {
        // Extract public_id from Cloudinary URL
        const urlParts = booking.paymentSlip.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split(".")[0]; // Remove file extension

        try {
          await cloudinary.uploader.destroy(`payment-slips/${publicId}`);
          console.log(`Deleted payment slip: payment-slips/${publicId}`);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting payment slip from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    // ลบ QR Code images จาก Cloudinary (จาก payment records)
    for (const payment of place.payments) {
      if (payment.qrCodePublicId) {
        try {
          await cloudinary.uploader.destroy(payment.qrCodePublicId);
          console.log(`Deleted QR code: ${payment.qrCodePublicId}`);
        } catch (cloudinaryError) {
          console.error(
            "Error deleting QR code from Cloudinary:",
            cloudinaryError
          );
        }
      }
    }

    // ลบข้อมูลในฐานข้อมูลตามลำดับ (ลบ dependencies ก่อน)

    // 1. ลบ bookings ก่อน (ถ้ามี)
    await prisma.booking.deleteMany({
      where: { placeId: Number(id) },
    });

    // 2. ลบ payment records ที่เกี่ยวข้องกับ place นี้
    await prisma.payment.deleteMany({
      where: { placeId: Number(id) },
    });

    // 3. ลบ favorites ที่อ้างอิงถึง place นี้
    await prisma.favorite.deleteMany({
      where: { placeId: Number(id) },
    });

    // 4. ลบ galleries
    await prisma.gallery.deleteMany({
      where: { placeId: Number(id) },
    });

    // 5. ลบ rooms
    await prisma.room.deleteMany({
      where: { placeId: Number(id) },
    });

    // 6. ลบ place สุดท้าย
    await prisma.place.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message:
        activeBookingsCount && activeBookingsCount > 0
          ? `ลบที่พักสำเร็จ (รวมถึงการจอง ${activeBookingsCount} รายการ, รูปภาพ ${
              place.galleries.length + 1
            } รูป, และข้อมูลการชำระเงิน ${place.payments.length} รายการ)`
          : `ลบที่พักสำเร็จ (รวมถึงรูปภาพ ${
              place.galleries.length + 1
            } รูป และข้อมูลการชำระเงิน ${place.payments.length} รายการ)`,
      deletedData: {
        place: 1,
        bookings: activeBookingsCount || 0,
        payments: place.payments.length,
        galleries: place.galleries.length,
        rooms: place.roomDetails.length,
      },
    });
  } catch (error) {
    console.error("Error deleting place:", error);

    // Handle specific Prisma errors
    if (error.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "ไม่สามารถลบได้เนื่องจากมีข้อมูลที่เกี่ยวข้องอยู่ กรุณาลบการจองก่อน",
        error: "Foreign key constraint violation",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลที่ต้องการลบ",
        error: "Record not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบข้อมูล",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });

    next(error);
  }
};
