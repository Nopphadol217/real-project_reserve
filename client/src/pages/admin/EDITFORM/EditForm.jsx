import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { editPlaceSchema } from "@/utils/schemas";
import EditInputForm from "./EditInputForm";
import EditTextArea from "./EditTextArea";
import EditCategorySelect from "./EditCategorySelect";
import EditMap from "./EditMap";
import { readPlace, updatePlace } from "@/api/createPlaceAPI";
import EditUploadImage from "./EditUploadImage";
import EditUploadGallery from "./EditUploadGallery";
import RoomManageEdit from "@/pages/admin/EDITFORM/RoomManageEdit";
import AmenitySelector from "@/components/form/AmenitySelector";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  MapPin,
  ImageIcon,
  Home,
  Settings,
  Save,
  ArrowLeft,
} from "lucide-react";

function EditForm() {
  const [isPlace, setIsPlace] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [roomDetails, setRoomDetails] = useState([]);
  const user = useAuthStore((state) => state.user);
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editPlaceSchema),
  });

  const {
    title,
    price,
    description,
    category,
    secure_url,
    public_id,
    lat,
    lng,
    galleries,
    rooms,
    amenities,
    roomDetails: existingRooms,
  } = isPlace;

  useEffect(() => {
    fetchReadPlace(id);
  }, [id, user]);

  useEffect(() => {
    if (isPlace && Object.keys(isPlace).length > 0) {
      setValue("title", title || "");
      setValue("price", price || "");
      setValue("description", description || "");
      setValue("category", category || "");
      setValue("rooms", rooms || 1);
      setValue("mainImage", { secure_url, public_id });
      setValue("lat", lat || null);
      setValue("lng", lng || null);
      setValue("galleryImages", galleries || []);

      // อัปเดต amenities
      const amenitiesData = amenities || [];
      setSelectedAmenities(amenitiesData);
      setValue("amenities", amenitiesData);

      // อัปเดต roomDetails - ให้ใช้ข้อมูลจาก API โดยตรง
      const roomDetailsData = existingRooms || [];
      console.log("Setting room details from API:", roomDetailsData);
      setRoomDetails(roomDetailsData);
      setValue("roomDetails", roomDetailsData);
    }
  }, [
    isPlace,
    title,
    price,
    description,
    category,
    rooms,
    secure_url,
    public_id,
    lat,
    lng,
    galleries,
    amenities,
    existingRooms,
    setValue,
  ]);

  const fetchReadPlace = async (id) => {
    setIsLoading(true);
    try {
      const res = await readPlace(id);

      setIsPlace(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        ...data,
        userId: user.id,
        amenities: selectedAmenities,
        roomDetails: roomDetails,
        rooms: roomDetails.length,
      };

      const res = await updatePlace(id, payload);
      toast.success(res.data.message, {
        description: "คุณได้อัพเดทสำเร็จเรียบร้อย",
      });
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดท");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && Object.keys(isPlace).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {user.role === "ADMIN" ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>กลับไปหน้ารายการ</span>
              </Link>
            ) : (
              <Link
                to="/business/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>กลับไปหน้ารายการ</span>
              </Link>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  แก้ไขข้อมูลที่พัก
                </h1>
                <p className="text-gray-600">จัดการข้อมูลที่พักของคุณ</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                ข้อมูลพื้นฐาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditInputForm
                  register={register}
                  name="title"
                  placeholder="ใส่ชื่อที่พัก เช่น โรงแรมสวยงาม"
                  label="ชื่อที่พักล่าสุด"
                  value={title}
                  errors={errors}
                />
                <EditInputForm
                  register={register}
                  name="price"
                  placeholder="ใส่ราคา เช่น 1500"
                  label="ราคาล่าสุด"
                  type="number"
                  value={price}
                  errors={errors}
                />
              </div>
              <EditTextArea
                register={register}
                name="description"
                placeholder="กรุณาใส่รายละเอียดของที่พัก เช่น สิ่งอำนวยความสะดวก กฎระเบียบ"
                label="รายละเอียดล่าสุด"
                value={description}
                errors={errors}
              />
              <EditCategorySelect
                register={register}
                name="category"
                label="หมวดหมู่ล่าสุด"
                value={category}
                error={errors.category?.message}
              />
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-500" />
                รูปภาพ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditUploadImage
                setValue={setValue}
                secure_url={isPlace.secure_url}
                public_id={isPlace.public_id}
                error={errors.mainImage?.message}
              />
              <EditUploadGallery
                setValue={setValue}
                galleries={galleries}
                error={errors.galleryImages?.message}
              />
            </CardContent>
          </Card>

          {/* Rooms Management */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-500" />
                จัดการห้องพัก
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RoomManageEdit
                value={roomDetails}
                onChange={(rooms) => {
                  setRoomDetails(rooms);
                  setValue("roomDetails", rooms);
                  setValue("rooms", rooms.length);
                }}
                existingRooms={isPlace.roomDetails || []} // ส่งข้อมูลห้องที่มีอยู่แล้ว
                errors={errors.roomDetails}
              />
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                สิ่งอำนวยความสะดวก
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AmenitySelector
                value={selectedAmenities}
                onChange={(amenities) => {
                  setSelectedAmenities(amenities);
                  setValue("amenities", amenities);
                }}
                error={errors.amenities?.message}
              />
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                ตำแหน่งที่ตั้ง
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPlace.lat && (
                <EditMap
                  register={register}
                  setValue={setValue}
                  lat={lat}
                  lng={lng}
                  location={[isPlace.lat, isPlace.lng]}
                  errors={errors}
                />
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="w-5 h-5" />
              {isLoading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditForm;
