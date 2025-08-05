const express = require("express");
const {
  createImage,
  createGallery,
  deleteImage,
  deleteGallery,
  deleteTempMainImage,
  deleteTempGallery,
  uploadQRCode,
  deleteQRCode,
} = require("../controllers/cloudinary");
const { upload, handleMulterError } = require("../middleware/upload");
const router = express.Router();

//@ENDPOINT METHOD POST
//UPLOAD MAIN IMAGE [http://localhost:5000/api/upload-main-image]
router.post("/upload-main-image", createImage);

//@ENDPOINT METHOD POST
// route.post("/upload-gallery")
router.post("/upload-gallery", createGallery);

//@ENDPOINT METHOD POST
//UPLOAD QR CODE [http://localhost:5000/api/upload-qr-code]
router.post(
  "/upload-qr-code",
  upload.single("qrCode"),
  handleMulterError,
  uploadQRCode
);

//@ENDPOINT METHOD DELETE
//Delete Gallery [http://localhost:5000/api/delete-gallery-image]
router.delete("/delete-gallery-image", deleteGallery);

//@ENDPOINT METHOD DELETE
//Delete main Image [http://localhost:5000/api/upload-main-image]
router.delete("/delete-main-image", deleteImage);

//@ENDPOINT METHOD DELETE
//Delete QR Code [http://localhost:5000/api/delete-qr-code]
router.delete("/delete-qr-code", deleteQRCode);

//@ENDPOINT METHOD DELETE
// route.delete("http://localhost:5000/api/delete-temp-main-image")
router.delete("/delete-temp-main-image", deleteTempMainImage);

//@ENDPOINT METHOD DELETE
// route.delete("http://localhost:5000/api/delete-temp-gallery")
router.delete("/delete-temp-gallery", deleteTempGallery);

module.exports = router;
