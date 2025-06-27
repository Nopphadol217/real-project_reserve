import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { RotateCw, X } from "lucide-react";
import { resizeFile } from "@/utils/resizeFile";
import { deleteTempGallery, uploadGalleryAPI, uploadImageAPI } from "@/api/UploadImageAPI";

function FormUploadGallery({ setValue, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const hdlOnChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
  
    try {
      setIsLoading(true);
  
      const newPreviews = [...previews];
      const newGalleryImages = [...galleryImages];
  
      for (const file of files) {
        if (newGalleryImages.length >= 8) break;
      
        const reader = new FileReader();
        const previewPromise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        const previewUrl = await previewPromise;
      
        try {
          const resizedImage = await resizeFile(file);
          const res = await uploadGalleryAPI({
            image: resizedImage,
          });
          
          console.log(res);
          
          if (res && res.data && res.data.result) {
            const image = res.data.result;
            
            newPreviews.push({
              image: res.data.result
            });
            newGalleryImages.push(image);
          } else {
            console.error('API response format incorrect:', res);
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
        }
      }
      
      setPreviews(newPreviews);
      setGalleryImages(newGalleryImages);
      console.log(newGalleryImages);
      setValue('galleryImages', newGalleryImages);
    
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
        await deleteTempGallery(imageToDelete.public_id );
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
    <div className="mb-4">
      <Label className="block mb-2">รูปภาพแกลเลอรี่</Label>
      <div className="flex items-center space-x-2 mb-2">
        <Input type="file" multiple onChange={hdlOnChange} accept="image/*" />
        {isLoading && <RotateCw className="animate-spin" />}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview.image.secure_url} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-24 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="text-sm text-gray-500 mt-1">
        เลือกได้หลายรูปภาพ (แนะนำไม่เกิน 15 รูป)
      </div>
    </div>
  );
}

export default FormUploadGallery;