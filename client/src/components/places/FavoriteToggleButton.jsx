import React from "react";
import useFavoriteStore from "@/store/useFavoriteStore";
import useAuthStore from "@/store/useAuthStore";
import { CardSubmitButtons } from "./CardSubmitButtons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { toastAlert } from "@/utils/toastAlert";

function FavoriteToggleButton({ placeId, isFavorite, name }) {
  const { user } = useAuthStore();
  const { actionAddOrRemoveFavorite } = useFavoriteStore();

  // Hook Form
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const hdlSubmit = async (e) => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด");
      window.location.href = "/auth/login";
      return;
    }

    // Delay for UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const res = await actionAddOrRemoveFavorite(placeId, isFavorite);
      console.log(res);
      const { message, success } = res;

      // Alert Favorite
      toastAlert(success, message, isFavorite, name);
    } catch (error) {
      console.error("Favorite toggle error:", error);
      toast.error("เกิดข้อผิดพลาดในการจัดการรายการโปรด");
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick}>
      <form onSubmit={handleSubmit(hdlSubmit)}>
        <CardSubmitButtons isPending={isSubmitting} isFavorite={isFavorite} />
      </form>
    </div>
  );
}

export default FavoriteToggleButton;
