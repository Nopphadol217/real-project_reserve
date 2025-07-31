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

    // 3️⃣ สร้างรายละเอียดห้องแต่ละห้อง
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
      },
    });

    // แปลง amenities JSON string กลับเป็น array
    const placesWithAmenities = places.map((place) => ({
      ...place,
      amenities: place.amenities ? JSON.parse(place.amenities) : [],
    }));

    res.json({ result: placesWithAmenities });
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

    // 4. จัดการข้อมูลห้อง
    // ลบข้อมูลห้องเดิม
    await prisma.room.deleteMany({
      where: { placeId: Number(id) },
    });

    // เพิ่มข้อมูลห้องใหม่
    if (roomDetails && roomDetails.length > 0) {
      const roomData = roomDetails.map((room) => ({
        name: room.name,
        price: parseInt(room.price),
        placeId: Number(id),
        status: false,
      }));

      await prisma.room.createMany({
        data: roomData,
      });
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
      message: "Update Successfully",
      place: placeWithAmenities,
    });
  } catch (error) {
    console.error("Error updating place:", error);
    next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        galleries: true,
        roomDetails: true,
      },
    });

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
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

    // ลบข้อมูลในฐานข้อมูลตามลำดับ (ลบ dependencies ก่อน)

    // 1. ลบ galleries ก่อน
    await prisma.gallery.deleteMany({
      where: { placeId: Number(id) },
    });

    // 2. ลบ rooms ก่อน
    await prisma.room.deleteMany({
      where: { placeId: Number(id) },
    });

    // 3. ลบ place สุดท้าย
    await prisma.place.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    console.error("Error deleting place:", error);
    next(error);
  }
};
