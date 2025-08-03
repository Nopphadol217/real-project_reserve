import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFavoriteStore from "@/store/useFavoriteStore";
import useAuthStore from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const FavoriteButton = ({
  placeId,
  size = "sm",
  className = "",
  showText = false,
}) => {
  const { user } = useAuthStore();
  const { isFavorite, actionAddOrRemoveFavorite, actionListFavorite, loading } =
    useFavoriteStore();

  const [isToggling, setIsToggling] = useState(false);
  const isFav = isFavorite(placeId);

  useEffect(() => {
    if (user) {
      actionListFavorite();
    }
  }, [user, actionListFavorite]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/auth/login";
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      const result = await actionAddOrRemoveFavorite(placeId, isFav);

      if (result.success) {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={handleToggleFavorite}
        className={cn(
          "border-gray-300 hover:border-pink-300 hover:bg-pink-50",
          className
        )}
      >
        <Heart className="w-4 h-4 mr-2" />
        {showText && "เข้าสู่ระบบ"}
      </Button>
    );
  }

  return (
    <Button
      variant={isFav ? "default" : "outline"}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isToggling || loading}
      className={cn(
        isFav
          ? "bg-pink-600 hover:bg-pink-700 border-pink-600 text-white"
          : "border-gray-300 hover:border-pink-300 hover:bg-pink-50",
        "transition-all duration-200",
        className
      )}
    >
      <Heart
        className={cn("w-4 h-4", showText && "mr-2", isFav && "fill-current")}
      />
      {showText && (
        <span>
          {isToggling ? "กำลังบันทึก..." : isFav ? "ลบจากโปรด" : "เพิ่มไปโปรด"}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
