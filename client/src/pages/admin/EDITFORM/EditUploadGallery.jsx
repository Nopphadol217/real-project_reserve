import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCw, X } from "lucide-react";
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
            // อัปเดต previews สำหรับแสดงหน้า UI
            const image = res.data.result;

            // อัปเดตหลัง upload เสร็จ
            newPreviews.push({
              image: res.data.result,
            });
            newGalleryImages.push(image);
          } else {
            console.error("API response format incorrect:", res);
          }
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
        }
      }
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
    <div className="mb-4">
      <Label className="block mb-2">รูปภาพแกลเลอรี่</Label>
      <div className="flex items-center space-x-2 mb-2">
        <Input type="file" multiple onChange={hdlOnChange} accept="image/*" />
        {isLoading && <RotateCw className="animate-spin" />}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      {!previews ? (
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-500 hover:bg-blue-600">
              เปิดดู gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>รายละเอียด</DialogTitle>
              <DialogDescription>รูป Gallery</DialogDescription>
              <ScrollArea className="w-[450px] whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                  {previews && previews.length > 0 ? (
                    previews.map((preview, index) => {
                      const { image } = preview;
                      const { secure_url, public_id, placeId } = image;
                      // console.log(secure_url, public_id, placeId);
                      return (
                        <figure key={index} className="shrink-0">
                          <div className="overflow-hidden rounded-md relative">
                            <img
                              key={index}
                              src={secure_url}
                              alt={
                                  public_id ||
                                `Gallery Image ${index + 1}`
                              }
                              className="aspect-video max-w-full sm:w-[150px] md:w-[250px] rounded-xl object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                            >
                              <X className="text-red-500 w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                hdlDelete(
                                  public_id,
                                  secure_url,
                                  placeId
                                )
                              }
                              className="absolute bottom-2 right-2 bg-red-500 text-white p-1 text-xs rounded"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "กำลังลบ..." : "ลบจาก Cloudinary"}
                            </button>
                          </div>
                        </figure>
                      );
                    })
                  ) : (
                    <div className="col-span-full aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
                      Image Not Found
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <DialogClose asChild>
                <Button className="bg-red-500">ปิด</Button>
              </DialogClose>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <div className="text-sm text-gray-500 mt-1">
        เลือกได้หลายรูปภาพ (แนะนำไม่เกิน 8 รูป)
      </div>
    </div>
  );
}
export default EditUploadGallery;
