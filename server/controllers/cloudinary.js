const prisma = require("../config/prisma");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

exports.createImage = async (req, res, next) => {
  try {
    const { image } = req.body;

    const result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: `place/main`,
    });
    res.json({ result: result });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  console.log("REQ BODY:", req.body); // ดูว่ามีข้อมูลครบไหม

  const { public_id, secure_url, id } = req.body;

  if (!public_id || !id) {
    return res.status(400).json({ message: "Missing public_id or id" });
  }

  try {
    // ลบจาก Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // ลบหรือเคลียร์ค่าใน DB
    await prisma.place.update({
      where: { id: Number(id) },
      data: {
        public_id: "",
        secure_url: "",
      },
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.createGallery = async (req, res, next) => {
  try {
    const { image } = req.body; // แก้ placesId → placeId
    console.log(image)
    const result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: `place/gallery`,
    });
    res.json({ result: result });
  } catch (error) {
    next(error);
  }
};

exports.deleteGallery = async (req, res, next) => {
  try {
    const { public_id, placeId } = req.body;

    // ✅ ลบจาก Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // ✅ หา record จากฐานข้อมูลก่อน
    const targetImage = await prisma.gallery.findFirst({
      where: {
        public_id,
        placeId,
      },
    });

    if (!targetImage) {
      return res.status(404).json({ message: "Image not found for this place" });
    }

    // ✅ ลบจากฐานข้อมูล
    await prisma.gallery.delete({
      where: { id: targetImage.id }, // ใช้ id ที่หาได้จริง
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ลบรูปหลักชั่วคราว (สำหรับการ upload/preview)
exports.deleteTempMainImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    // ลบจาก Cloudinary เท่านั้น (ไม่ต้องลบจาก DB เพราะยังไม่ได้บันทึก)
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.status(200).json({ message: "Temp image deleted successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete image from Cloudinary" });
    }
  } catch (error) {
    next(error);
  }
};

// ลบรูป Gallery ชั่วคราว (สำหรับการ upload/preview)
exports.deleteTempGallery = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    // ลบจาก Cloudinary เท่านั้น (ไม่ต้องลบจาก DB เพราะยังไม่ได้บันทึก)
    const result = await cloudinary.uploader.destroy(public_id);
    
    if (result.result === 'ok') {
      res.status(200).json({ message: "Temp gallery image deleted successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete image from Cloudinary" });
    }
  } catch (error) {
    next(error);
  }
};