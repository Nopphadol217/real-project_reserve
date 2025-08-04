const prisma = require("../config/prisma");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// อัปโหลด QR Code สำหรับ createListing
exports.uploadQRCode = async (req, res, next) => {
  try {
    const { qrCode } = req.body;

    const result = await cloudinary.uploader.upload(qrCode, {
      public_id: `qr_${Date.now()}`,
      resource_type: "auto",
      folder: `payment/qr_codes`,
    });

    res.json({ success: true, result: result });
  } catch (error) {
    next(error);
  }
};

// ลบ QR Code
exports.deleteQRCode = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    // ลบจาก Cloudinary
    await cloudinary.uploader.destroy(public_id);

    res
      .status(200)
      .json({ success: true, message: "QR Code deleted successfully" });
  } catch (error) {
    next(error);
  }
};

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
    console.log(image);
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
      return res
        .status(404)
        .json({ message: "Image not found for this place" });
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

    if (result.result === "ok") {
      res.status(200).json({ message: "Temp image deleted successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Failed to delete image from Cloudinary" });
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

    if (result.result === "ok") {
      res
        .status(200)
        .json({ message: "Temp gallery image deleted successfully" });
    } else {
      res
        .status(400)
        .json({ message: "Failed to delete image from Cloudinary" });
    }
  } catch (error) {
    next(error);
  }
};

// อัปโหลด QR Code สำหรับการชำระเงิน
exports.uploadQRCode = async (req, res, next) => {
  try {
    // Check if file was uploaded via multer
    if (req.file) {
      // Convert buffer to base64 for Cloudinary
      const fileStr = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(fileStr, {
        public_id: `qr-${Date.now()}`,
        resource_type: "auto",
        folder: `payment/qr_codes`,
      });

      res.json({
        success: true,
        result: {
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
      });
    } else if (req.body.qrCode) {
      // Fallback to body data (base64)
      const result = await cloudinary.uploader.upload(req.body.qrCode, {
        public_id: `qr-${Date.now()}`,
        resource_type: "auto",
        folder: `payment/qr_codes`,
      });

      res.json({
        success: true,
        result: {
          public_id: result.public_id,
          secure_url: result.secure_url,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Missing QR Code image",
      });
    }
  } catch (error) {
    console.error("QR Code upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload QR Code",
      error: error.message,
    });
  }
};

// ลบ QR Code
exports.deleteQRCode = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Missing public_id" });
    }

    // ลบจาก Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      res.status(200).json({
        success: true,
        message: "QR Code deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete QR Code from Cloudinary",
      });
    }
  } catch (error) {
    console.error("QR Code delete error:", error);
    next(error);
  }
};
