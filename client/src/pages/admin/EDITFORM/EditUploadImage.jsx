import { deleteImageAPI, uploadImageAPI } from "@/api/UploadImageAPI";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resizeFile } from "@/utils/resizeFile";
import { RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditUploadImage = ({ setValue, error, secure_url, public_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();

  const [preview, setPreview] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (secure_url) {
      setPreview(secure_url);
    } else if (!secure_url) return;
  }, [secure_url]);

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
        placeId: "temp-place-id", // หรือส่ง null ถ้ายังไม่มี
      });
      const secureUrl = res.data.result.secure_url;

      // เก็บข้อมูลรูปภาพเป็น base64 ใน form state
      setValue("mainImage", res.data.result);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  // ฟังก์ชันลบรูปจาก Cloudinary
  const hdlDelete = async (public_id, secure_url, id) => {
    try {
      // เรียกใช้ API ลบรูป
      const res = await deleteImageAPI(public_id, secure_url, id);
      console.log(res);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // ลบ preview และ clear ค่าใน form
      setPreview(null);
      setValue("mainImage", null); // ทำให้ field mainImage ใน form กลับมาเป็น null
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <div className="mb-4">
      <Label className="block mb-2">รูปภาพหลัก</Label>
      {!preview ? (
        <div>
          <p className="text-red-500 mb-2">
            ไม่พบรูปภาพเดิม หรืออาจถูกลบไปแล้ว
          </p>
          <div className="flex items-center space-x-2">
            <Input type="file" onChange={hdlOnChange} />
            {isLoading && <RotateCw className="animate-spin" />}
          </div>
        </div>
      ) : (
        <div className="space-y-2 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500">ดูรูปหลัก</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>รูปหลัก</DialogTitle>
                <DialogDescription>
                  คุณแน่ใจหรือไม่?ที่จะลบรูป
                </DialogDescription>
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-full w-[50px] object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setValue("mainImage", null);
                    }}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                  >
                    <span className="text-red-500">×</span>
                  </button>
                  {/* ปุ่มลบรูป */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSubmit(() => hdlDelete(public_id, secure_url, id))()
                    }
                    className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    disabled={isSubmitting} // ปิดปุ่มหากฟอร์มกำลัง submit
                  >
                    {isSubmitting ? "กำลังลบ..." : "ลบรูป"}
                  </button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-2">
            <Input type="file" onChange={hdlOnChange} />
            {isLoading && <RotateCw className="animate-spin" />}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default EditUploadImage;
