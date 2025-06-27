const prisma = require("../config/prisma");
const { deleteImage } = require("./cloudinary");


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
    } = req.body;
    console.log("req.body", req.body);
    // 1️⃣ สร้าง place ก่อน
    const place = await prisma.place.create({
      data: {
        title: title,
        description: description,
        price: price,
        category: category,
        lat: lat,
        lng:lng,
        public_id:mainImage.public_id,
        secure_url: mainImage.secure_url,
        userId: userId,
      },
    });

    // 2️⃣ ใช้ place.id ไปสร้าง gallery หลายตัว
    const galleryData = req.body.galleryImages.map((img) => ({
      public_id: img.public_id,
      secure_url: img.secure_url,
      placeId: place.id, // อ้างอิงไปยัง Place ที่เพิ่งสร้าง
    }));
    // console.log("galleryData", galleryData);
    await prisma.gallery.createMany({
      data: galleryData,
    });

    res.json({ message: "Create Place Successfully." });
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
      },
    });
    res.json({ result: places });
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
      },
    });
    res.json({ result: place });
    console.log(id);
  } catch (error) {
    next(error);
  }
};

exports.updatePlace = async (req, res, next) => {
  const { title, description, price, category, lat, lng, mainImage, userId } =
    req.body;
  const { id } = req.params;

  try {
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
        userId,
      },
    });
    await prisma.gallery.deleteMany({
      where: { placeId: Number(id) },
    });
    // 3. เพิ่มรูป gallery ใหม่
    const galleryData = req.body.galleryImages.map((img) => ({
      secure_url: img.secure_url,
      public_id: img.public_id,
      placeId: Number(id),
    }));
    console.log(galleryData);
    await prisma.gallery.createMany({
      data: galleryData,
    });

    res.status(200).json({ message: "Update Successfully", place: place });
  } catch (error) {
    next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  const { id } = req.params;
  console.log(req.body)
  try {
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
      include: {
        galleries: true,
      },
    });
     //  ลบรูปภาพหลักออกจาก Cloudinary
    if (place.public_id) {
      await cloudinary.uploader.destroy(place.public_id);
    }

    //  ลบรูป Gallery ออกจาก Cloudinary
    for (const gallery of place.galleries) {
      if (gallery.public_id) {
        await cloudinary.uploader.destroy(gallery.public_id);
      }
    }
    // ✅ ลบ place => Prisma จะ cascade ลบ gallery, room ให้อัตโนมัติ
    await prisma.place.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error("Error deleting place:", error);
    next(error);
  }
};