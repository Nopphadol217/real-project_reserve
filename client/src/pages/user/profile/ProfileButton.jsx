import useAuthStore from "@/store/useAuthStore";
import { UserCircle } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ProfileButton() {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      {user ? (
        <div className="flex justify-center items-center">
          <Avatar className="h-[30px] w-[30px]">
            <AvatarImage
              src={user?.picture}
              className="object-cover "
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className=" text-white font-semibold text-sm ml-2 mr-5 hidden md:block items-center">
            {user?.firstname}
          </span>
        </div>
      ) : (
        <UserCircle className="text-white" />
      )}
    </div>
  );
}
export default ProfileButton;
