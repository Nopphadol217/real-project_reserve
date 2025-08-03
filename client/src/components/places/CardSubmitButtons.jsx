import { Heart, RotateCw } from "lucide-react";
import { Card } from "../ui/card";

export function CardSubmitButtons({ isPending, isFavorite }) {
  return (
    <Card className="p-1 rounded-full items-center">
      <button
        className="hover:scale-110 hover:duration-300 
    transition-transform ease-in-out 
    flex justify-center
    "
        size={11}
      >
        {isPending ? (
          <RotateCw className="animate-spin" />
        ) : isFavorite ? (
          <Heart className="fill-red-600 opacity-90 text-red-600 " />
        ) : (
          <Heart className="fill-gray-500 opacity-40 " />
        )}
      </button>
    </Card>
  );
}

export function CardSignInButtons() {
  return <div>CardSubmitButton</div>;
}
