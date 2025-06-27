import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { editPlaceSchema } from "@/utils/schemas";
import InputForm from "@/components/form/InputForm";
import { Label } from "@/components/ui/label";
import EditInputForm from "./EditInputForm";
import EditTextArea from "./EditTextArea";
import CategorySelect from "@/components/form/CategorySelect";
import EditCategorySelect from "./EditCategorySelect";
import MainMap from "@/components/map/MainMap";
import EditMap from "./EditMap";
import { useParams } from "react-router";
import { readPlace, updatePlace } from "@/api/createPlaceAPI";
import EditUploadImage from "./EditUploadImage";
import EditUploadGallery from "./EditUploadGallery";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import Buttons from "@/components/form/Buttons";

function EditForm() {
  const [isPlace, setIsPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false); //เก็บค่า resAPI เด้อ res.data.result
  const user = useAuthStore((state) => state.user);

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
  } = isPlace;
  const isId = isPlace.id;
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editPlaceSchema),
  });

  useEffect(() => {
    fetchReadPlace(id);
  }, [isId]);


  useEffect(()=>{
    if(isPlace){
      setValue("title", title || "")
      setValue("price", price || "")
      setValue("description", description || "")
      setValue("category", category || "")
      // แก้ไขให้ถูกต้อง
      setValue("mainImage", { secure_url, public_id })
      setValue("lat", lat || null)
      setValue("lng", lng || null)
      setValue("galleryImages", galleries || [])
    }
  },[isPlace])
  const fetchReadPlace = async (id) => {
    setIsLoading(true);
    try {
      const res = await readPlace(id);
      console.log(res);
      setIsPlace(res.data.result);
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // เช็คว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่
      const changedFields = Object.keys(data).filter(key => 
        JSON.stringify(data[key]) !== JSON.stringify(isPlace[key])
      );

      if (changedFields.length === 0) {
        toast.message("ไม่มีข้อมูลที่เปลี่ยนแปลง");
        return;
      }

      const payload = {
        ...data,
        userId: user.id,
      };
      
      const res = await updatePlace(id, payload);
      toast.message(res.data.message, {
        description: "คุณได้อัพเดทสำเร็จเรียบร้อย"
      });

      // Refresh ข้อมูลหลังอัพเดท
      fetchReadPlace(id);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัพเดท");
      console.error(error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
      <h1 className="text-2xl font-semibold">Edit (แก้ไขข้อมูล)</h1>
      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <EditInputForm
            register={register}
            name="title"
            placeholder="ใส่ชื่อที่พัก เช่น บ้านดอยวิว"
            type="text"
            label="ชื่อที่พักล่าสุด"
            value={title}
            errors={errors}
          />
        </div>
        <div>
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
        <div>
          <EditTextArea
            register={register}
            name="description"
            placeholder="กรุณาใส่รายละเอียดของที่พัก เช่น สิ่งอำนวยความสะดวก กฎระเบียบ"
            label="รายละเอียดล่าสุด"
            value={description}
            errors={errors}
          />
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
        </div>
        <div>
          <EditCategorySelect
            register={register}
            name="category"
            label="ประเภทที่พัก"
            value={category}
            setValue={setValue}
            errors={errors}
          />

          {isPlace.lat && (
            <EditMap
              register={register}
              lat={isPlace.lat}
              lng={isPlace.lng}
              location={[isPlace.lat, isPlace.lng]}
              setValue={setValue}
            />
          )}
        </div>
      </div>
      <Buttons type="submit"  text="Update" isPending={isSubmitting} ></Buttons>
    </form>
  );
}

export default EditForm;
