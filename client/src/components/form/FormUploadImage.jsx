import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { resizeFile } from "@/utils/resizeFile";
import { deleteTempMainImage, uploadImageAPI } from "@/api/UploadImageAPI";

function FormUploadImage({ setValue, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null); // เก็บข้อมูลรูปภาพสำหรับลบ

  const hdlOnChange = async (e) => {
    const file = e.target.files[0];
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
    <div className="mb-4">
      <Label className="block mb-2">รูปภาพหลัก</Label>
      {!preview ? (
        <div className="flex items-center space-x-2">
          <Input type="file" onChange={hdlOnChange} />
          {isLoading && <RotateCw className="animate-spin" />}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={hdlDeleteImage}
              disabled={isLoading}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            >
              {isLoading ? (
                <RotateCw className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <span className="text-red-500">×</span>
              )}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Input type="file" onChange={hdlOnChange} />
            {isLoading && <RotateCw className="animate-spin" />}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default FormUploadImage;