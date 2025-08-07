import { useForm } from "react-hook-form";
import { Heart, RotateCw } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import usePlaceStore from "@/store/usePlaceStore";
import useAuthStore from "@/store/useAuthStore";
import { toast } from "sonner";
import { AddOrRemoveFavorite } from "@/api/favoriteAPI";

function FavoriteToggleButton({
  placeId,
  isFavorite,
  placeName,
  onFavoriteChange,
}) {
  const user = useAuthStore((state) => state.user);
  const actionFavoritePlace = usePlaceStore(
    (state) => state.actionFavoritePlace
  );

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleFavoriteSubmit = async () => {
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการโปรด");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Loading simulation

      const result = await actionFavoritePlace(user.token, {
        placeId,
        isFavorite,
      });

      // อัปเดต UI state ทันที
      if (onFavoriteChange) {
        onFavoriteChange(!isFavorite);
      }

      const { message, success } = result;

      if (success) {
        if (isFavorite) {
          toast.success(`ลบ ${placeName} ออกจากรายการโปรดแล้ว`, {
            description: "คุณสามารถเพิ่มกลับได้ตลอดเวลา",
          });
        } else {
          toast.success(`เพิ่ม ${placeName} ในรายการโปรดแล้ว`, {
            description: "ตรวจสอบได้ในหน้ารายการโปรด",
          });
        }
      } else {
        toast.error(message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");

      // หากเกิดข้อผิดพลาด ให้ revert state กลับ
      if (onFavoriteChange) {
        onFavoriteChange(isFavorite);
      }
    }
  };

  if (!user) {
    return (
      <Card className="p-1 rounded-full items-center">
        <button
          size={11}
          className="z-10 cursor-pointer hover:scale-110 hover:duration-300 transition-transform ease-in-out p-1 h-auto"
          onClick={() => toast.info("กรุณาเข้าสู่ระบบเพื่อเพิ่มรายการโปรด")}
        >
          <Heart className="w-5 h-5 fill-gray-400 text-gray-400" />
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-1 rounded-full items-center">
      <form onSubmit={handleSubmit(handleFavoriteSubmit)}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          disabled={isSubmitting}
          className="hover:scale-110 hover:duration-300 transition-transform ease-in-out p-1 h-auto"
        >
          {isSubmitting ? (
            <RotateCw className="w-5 h-5 animate-spin text-gray-500" />
          ) : isFavorite ? (
            <Heart className="w-5 h-5 fill-red-600 text-red-600" />
          ) : (
            <Heart className="w-5 h-5 fill-gray-400 text-gray-400 hover:fill-red-200 hover:text-red-400" />
          )}
        </Button>
      </form>
    </Card>
  );
}

export default FavoriteToggleButton;
