import BreadcrumbForm from "@/components/form/BreadcrumbForm";
import { Card } from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { placeSchema } from "@/utils/schemas";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateListing = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      lat: null,
      lng: null,

    }
  });
  
  const hdlSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // เพิ่ม userId เข้าไปในข้อมูล
      const payload = {
        ...data,
        userId: user.id,
      };
      console.log(payload)
      
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
      
      const response = await createPlace(payload);
      
      toast.success("สร้างที่พักสำเร็จ");
      console.log("สร้างที่พักสำเร็จ:", response);
      
      // รีเซ็ตฟอร์มและ redirect ไปหน้าแสดงรายการที่พัก
      reset();
      // navigate('/my-listings');
      
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้างที่พัก");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarInset>
      <Card>
        <section className="m-10">
          <div>
            <h1 className="text-2xl font-semibold">Create Listing</h1>
            <Separator className="mr-2 h-[1px] mb-4" />
          </div>
          <form onSubmit={handleSubmit(hdlSubmit)}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
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
                
                <TextAreaInput
                  register={register}
                  name="description"
                  label="รายละเอียดที่พัก"
                  placeholder="กรุณาใส่รายละเอียดของที่พัก เช่น สิ่งอำนวยความสะดวก กฎระเบียบ"
                  errors={errors}
                />
                
                <CategorySelect
                  register={register}
                  name="category"
                  label="ประเภทที่พัก"
                  setValue={setValue}
                  errors={errors}
                />
              </div>
              
              <div>
                <FormUploadImage 
                  setValue={setValue} 
                  error={errors.mainImage?.message}
                />
                
                <FormUploadGallery 
                  setValue={setValue}
                  error={errors.galleryImages?.message}
                />
                
                <MainMap 
                  register={register} 
                  setValue={setValue}
                  latError={errors.lat?.message}
                  lngError={errors.lng?.message}
                />
              </div>
            </div>

            <div className="mt-6">
              <Buttons text="สร้างที่พัก" isPending={isSubmitting} />
            </div>
          </form>
        </section>
      </Card>
    </SidebarInset>
  );
};

export default CreateListing;
