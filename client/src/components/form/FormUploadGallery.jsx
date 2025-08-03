import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { RotateCw, X, Upload, Image } from "lucide-react";
import { resizeFile } from "@/utils/resizeFile";
import {
  deleteTempGallery,
  uploadGalleryAPI,
  uploadImageAPI,
} from "@/api/UploadImageAPI";
import { FileUpload } from "../ui/file-upload";
import { motion } from "motion/react";

function FormUploadGallery({ setValue, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleFileUpload = async (files) => {
    if (!files.length) return;

    try {
      setIsLoading(true);

      const newPreviews = [...previews];
      const newGalleryImages = [...galleryImages];

      // รองรับการอัพโหลดหลายไฟล์พร้อมกัน
      const uploadPromises = Array.from(files)
        .slice(0, 15 - newGalleryImages.length)
        .map(async (file) => {
          try {
            const resizedImage = await resizeFile(file);
            const res = await uploadGalleryAPI({
              image: resizedImage,
            });

            if (res && res.data && res.data.result) {
              return {
                preview: { image: res.data.result },
                image: res.data.result,
              };
            }
            return null;
          } catch (uploadError) {
            console.error("Upload error for file:", file.name, uploadError);
            return null;
          }
        });

      const results = await Promise.all(uploadPromises);

      results.forEach((result) => {
        if (result) {
          newPreviews.push(result.preview);
          newGalleryImages.push(result.image);
        }
      });

      setPreviews(newPreviews);
      setGalleryImages(newGalleryImages);
      console.log(newGalleryImages);
      setValue("galleryImages", newGalleryImages);

      setIsLoading(false);
    } catch (error) {
      console.error("Overall upload error:", error);
      setIsLoading(false);
    }
  };

  const removeImage = async (index) => {
    try {
      // ลบรูปจาก Cloudinary
      const imageToDelete = galleryImages[index];
      if (imageToDelete && imageToDelete.public_id) {
        await deleteTempGallery(imageToDelete.public_id);
      }

      // อัพเดท state
      const newPreviews = [...previews];
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);

      const newGalleryImages = [...galleryImages];
      newGalleryImages.splice(index, 1);
      setGalleryImages(newGalleryImages);

      // อัพเดท form value
      setValue("galleryImages", newGalleryImages);
    } catch (error) {
      console.error("Error deleting image:", error);
      // ยังคงลบจาก UI แม้ว่าการลบจาก Cloudinary จะล้มเหลว
      const newPreviews = [...previews];
      newPreviews.splice(index, 1);
      setPreviews(newPreviews);

      const newGalleryImages = [...galleryImages];
      newGalleryImages.splice(index, 1);
      setGalleryImages(newGalleryImages);

      setValue("galleryImages", newGalleryImages);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-3 block">
          รูปภาพแกลเลอรี่
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          อัปโหลดรูปภาพเพิ่มเติมเพื่อแสดงในแกลเลอรี่ (สูงสุด 15 รูป)
        </p>

        {/* Modern File Upload */}
        <div className="relative mb-4">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <RotateCw className="animate-spin w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  กำลังอัปโหลด...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Alternative Input Upload - รองรับหลายไฟล์ */}
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            หรือเลือกไฟล์จากคอมพิวเตอร์
          </Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              if (files.length > 0) {
                handleFileUpload(files);
              }
            }}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isLoading || galleryImages.length >= 15}
          />
          <p className="text-xs text-gray-500 mt-1">
            เลือกได้หลายไฟล์พร้อมกัน (Ctrl+คลิก หรือ Shift+คลิก)
          </p>
        </div>

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Gallery Preview */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-900">
              รูปภาพที่อัปโหลดแล้ว
            </h4>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {previews.length}/15 รูป
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={preview.image.secure_url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg 
                           flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Image className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-sm font-medium text-blue-900">
              คำแนะนำการอัปโหลด
            </h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• รองรับไฟล์: JPG, PNG, WebP</li>
              <li>• ขนาดไฟล์ไม่เกิน 5MB ต่อรูป</li>
              <li>• ความละเอียดแนะนำ: 1200x800 pixels ขึ้นไป</li>
              <li>• สามารถอัปโหลดได้สูงสุด 15 รูป</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormUploadGallery;
