import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { RotateCw, X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { resizeFile } from "@/utils/resizeFile";
import { deleteTempMainImage, uploadImageAPI } from "@/api/UploadImageAPI";
import { FileUpload } from "../ui/file-upload";
import { motion } from "motion/react";

function FormUploadImage({ setValue, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null); // เก็บข้อมูลรูปภาพสำหรับลบ

  const handleFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    try {
      setIsLoading(true);

      // แสดง Preview รูปภาพ
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Resize รูปภาพ
      const resizedImage = await resizeFile(file);
      const res = await uploadImageAPI({
        image: resizedImage,
        placeId: "temp-place-id",
      });

      console.log(res);

      // เก็บข้อมูลรูปภาพ
      const imageResult = res.data.result;
      setImageData(imageResult);
      setValue("mainImage", imageResult);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const hdlDeleteImage = async () => {
    try {
      setIsLoading(true);

      // ลบรูปจาก Cloudinary ถ้ามีข้อมูลรูปภาพ
      if (imageData && imageData.public_id) {
        await deleteTempMainImage(imageData.public_id); // ส่ง public_id โดยตรง
      }

      // รีเซ็ต state
      setPreview(null);
      setImageData(null);
      setValue("mainImage", null);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold text-gray-900 mb-3 block">
          รูปภาพหลัก
        </Label>
        <p className="text-sm text-gray-600 mb-4">
          อัปโหลดรูปภาพหลักที่จะแสดงเป็นตัวแทนของที่พัก
        </p>
      </div>

      {!preview ? (
        <div className="relative">
          <FileUpload onChange={handleFileUpload} />
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
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl shadow-lg"
            >
              <img
                src={preview}
                alt="รูปภาพหลัก"
                className="w-full aspect-video object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Delete Button */}
              <button
                type="button"
                onClick={hdlDeleteImage}
                disabled={isLoading}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg 
                         flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <RotateCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>

              {/* Success Badge */}
              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>อัปโหลดสำเร็จ</span>
              </div>
            </motion.div>
          </div>

          {/* Replace Button */}
          <div className="flex justify-center">
            <div className="relative">
              <FileUpload onChange={handleFileUpload} />
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center pointer-events-none">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">เปลี่ยนรูปภาพ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ImageIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-sm font-medium text-green-900">
              คำแนะนำสำหรับรูปภาพหลัก
            </h5>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• ใช้รูปภาพที่มีคุณภาพสูงและชัดเจน</li>
              <li>• แสดงมุมมองที่ดีที่สุดของที่พัก</li>
              <li>• หลีกเลี่ยงรูปที่มืนหรือเบลอ</li>
              <li>• ขนาดไฟล์ไม่เกิน 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormUploadImage;
