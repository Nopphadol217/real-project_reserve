import BreadcrumbForm from "@/components/form/BreadcrumbForm";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import InputForm from "@/components/form/InputForm";
import { useForm } from "react-hook-form";
import TextAreaInput from "@/components/form/TextAreaInput";
import CategorySelect from "@/components/form/CategorySelect";
import useAuthStore from "@/store/useAuthStore";
import Buttons from "@/components/form/Buttons";
import { createPlace } from "@/api/createPlaceAPI";
import MainMap from "@/components/map/MainMap";
import FormUploadImage from "@/components/form/FormUploadImage";
import FormUploadGallery from "@/components/form/FormUploadGallery";
import RoomManager from "@/components/form/RoomManager";
import AmenitySelector from "@/components/form/AmenitySelector";
import UploadPaymentInfo from "@/components/form/UploadPaymentInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { placeSchema } from "@/utils/schemas";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCallback } from "react";
import {
  Home,
  MapPin,
  ImageIcon,
  DollarSign,
  FileText,
  Tag,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Utensils,
  Laptop,
  Trees,
  Waves,
  Shield,
  Bed,
  Plus,
  Minus,
} from "lucide-react";

const CreateListing = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [roomDetails, setRoomDetails] = useState([{ name: "", price: "" }]);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      lat: null,
      lng: null,
      rooms: 1,
      amenities: [],
    },
  });

  // อัปเดต setValue เมื่อ amenities เปลี่ยน
  useEffect(() => {
    setValue("amenities", selectedAmenities);
  }, [selectedAmenities, setValue]);

  // อัปเดต setValue เมื่อ roomDetails เปลี่ยน
  useEffect(() => {
    setValue(
      "roomDetails",
      roomDetails.filter((room) => room.name && room.price)
    );
  }, [roomDetails, setValue]);

  const hdlSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // เพิ่ม userId และข้อมูลห้อง
      const payload = {
        ...data,
        userId: user.id,
        roomDetails: roomDetails.filter((room) => room.name && room.price), // กรองห้องที่มีข้อมูลครบ
        paymentInfo: paymentInfo, // เพิ่มข้อมูลการชำระเงิน
      };
      console.log(payload);

      // ตรวจสอบข้อมูลที่จำเป็นอีกครั้ง (double check)
      if (!payload.mainImage) {
        toast.error("กรุณาอัพโหลดรูปภาพหลัก");
        setIsSubmitting(false);
        return;
      }

      if (!payload.lat || !payload.lng) {
        toast.error("กรุณาเลือกตำแหน่งบนแผนที่");
        setIsSubmitting(false);
        return;
      }

      // ตรวจสอบข้อมูลห้อง
      if (payload.roomDetails.length === 0) {
        toast.error("กรุณากรอกข้อมูลห้องอย่างน้อย 1 ห้อง");
        setIsSubmitting(false);
        return;
      }

      const response = await createPlace(payload);

      toast.success("สร้างที่พักสำเร็จ");
      console.log("สร้างที่พักสำเร็จ:", response);

      // รีเซ็ตฟอร์มและ redirect ไปหน้าแสดงรายการที่พัก
      reset();
      setSelectedAmenities([]);
      setRoomDetails([{ name: "", price: "" }]);
      navigate("/admin/manage-list");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างที่พัก"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarInset>
      <div className="p-8 w-full mx-auto bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                สร้างที่พักใหม่
              </h1>
              <p className="text-lg text-gray-600">
                เพิ่มข้อมูลที่พักของคุณให้ครบถ้วนและสวยงาม
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(hdlSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <FileText className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                ข้อมูลพื้นฐาน
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <InputForm
                register={register}
                name="title"
                label="ชื่อที่พัก"
                placeholder="ใส่ชื่อที่พัก เช่น บ้านดอยวิว"
                type="text"
                errors={errors}
              />

              <InputForm
                register={register}
                name="price"
                label="ราคาต่อคืน (บาท)"
                placeholder="ใส่ราคา เช่น 1500"
                type="number"
                errors={errors}
              />

              <InputForm
                register={register}
                name="rooms"
                label="จำนวนห้อง"
                placeholder="เช่น 2"
                type="number"
                errors={errors}
                min="1"
              />
            </div>

            <div className="mt-4">
              <TextAreaInput
                register={register}
                name="description"
                label="รายละเอียดที่พัก"
                placeholder="กรุณาใส่รายละเอียดของที่พัก เช่น สิ่งอำนวยความสะดวก กฎระเบียบ"
                errors={errors}
              />
            </div>

            <div className="mt-4">
              <CategorySelect
                register={register}
                name="category"
                label="ประเภทที่พัก"
                setValue={setValue}
                errors={errors}
              />
            </div>

            {/* Amenities Section */}
            <AmenitySelector
              value={selectedAmenities}
              onChange={setSelectedAmenities}
              errors={errors.amenities?.message}
            />

            {/* Room Details Section */}
            <RoomManager
              value={roomDetails}
              onChange={setRoomDetails}
              errors={errors.roomDetails}
            />
          </Card>

          {/* Images Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <ImageIcon className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                รูปภาพที่พัก
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormUploadImage
                setValue={setValue}
                error={errors.mainImage?.message}
              />

              <FormUploadGallery
                setValue={setValue}
                error={errors.galleryImages?.message}
              />
            </div>
          </Card>

          {/* Location Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                ตำแหน่งที่ตั้ง
              </h2>
            </div>

            <MainMap
              register={register}
              setValue={setValue}
              latError={errors.lat?.message}
              lngError={errors.lng?.message}
            />
          </Card>

          {/* Payment Info Section */}
          <UploadPaymentInfo
            onPaymentInfoChange={setPaymentInfo}
            initialData={null}
          />

          {/* Submit Button */}
          <Card className="p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                ยกเลิก
              </button>
              <Buttons text="สร้างที่พัก" isPending={isSubmitting} />
            </div>
          </Card>
        </form>
      </div>
    </SidebarInset>
  );
};

export default CreateListing;
