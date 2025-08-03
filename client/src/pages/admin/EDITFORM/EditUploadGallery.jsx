import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCw, X, Upload, Image, Eye, Trash2, Grid3X3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { deleteGalleryImageAPI, uploadGalleryAPI } from "@/api/UploadImageAPI";
import { useForm } from "react-hook-form";
import { resizeFile } from "@/utils/resizeFile";
import { motion } from "motion/react";
import { FileUpload } from "@/components/ui/file-upload";
function EditUploadGallery({ setValue, galleries, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (galleries && galleries.length > 0) {
      const previewFormat = galleries.map((img) => ({ image: img }));
      setPreviews(previewFormat); // สำหรับ preview
      setGalleryImages(galleries); // สำหรับส่งกลับ form
    }
  }, [galleries]);

  const hdlOnChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    await handleFileUpload(files);
  };

  // ฟังก์ชันสำหรับ FileUpload component และ input file
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
      setValue("galleryImages", newGalleryImages);

      setIsLoading(false);
    } catch (error) {
      console.error("Overall upload error:", error);
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);

    const newGalleryImages = [...galleryImages];
    newGalleryImages.splice(index, 1);
    setGalleryImages(newGalleryImages);

    setValue("galleryImages", newGalleryImages);
  };

  // ฟังก์ชันลบรูปจาก Cloudinary
  const hdlDelete = async (public_id, secure_url, placeId) => {
    try {
      const res = await deleteGalleryImageAPI(public_id, secure_url, placeId);
      console.log(res);

      // อัปเดต previews
      const filteredPreviews = previews.filter(
        (p) => p.image.public_id !== public_id
      );
      const filteredGallery = galleryImages.filter(
        (img) => img.public_id !== public_id
      );

      setPreviews(filteredPreviews);
      setGalleryImages(filteredGallery);
      setValue("galleryImages", filteredGallery);
    } catch (error) {
      console.error("Failed to delete image", error);
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
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="flex items-center space-x-2">
                <RotateCw className="animate-spin w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  กำลังอัปโหลด...
                </span>
              </div>
            </div>
          )}

          <FileUpload onChange={handleFileUpload} />
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
            onChange={hdlOnChange}
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
            {previews.map((preview, index) => {
              const { image } = preview;
              const { secure_url, public_id, placeId } = image;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={secure_url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center space-x-2">
                    {/* Preview Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-8 h-8 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg flex items-center justify-center transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            รูปภาพแกลเลอรี่ #{index + 1}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img
                            src={secure_url}
                            alt={`Gallery ${index + 1}`}
                            className="max-w-full max-h-[60vh] object-contain rounded-lg"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete from UI Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200"
                      title="ลบจาก UI เท่านั้น"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Delete from Cloudinary Button */}
                    <button
                      type="button"
                      onClick={() => hdlDelete(public_id, secure_url, placeId)}
                      disabled={isSubmitting}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                      title="ลบจาก Cloudinary"
                    >
                      {isSubmitting ? (
                        <RotateCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </motion.div>
              );
            })}
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
              <li>• ปุ่มสีเหลือง: ลบจาก UI | ปุ่มสีแดง: ลบจาก Cloudinary</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditUploadGallery;
