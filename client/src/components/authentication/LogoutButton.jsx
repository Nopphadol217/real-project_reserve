import { logoutAPI } from "@/api/authAPI";
import useAuthStore from "@/store/useAuthStore";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { forwardRef } from "react";

const LogoutButton = forwardRef((props, ref) => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const dateTime = new Date().toLocaleString();
  const handleLogout = async () => {
    try {
      const res = await logoutAPI();
      clearAuth();
      toast.message(<p className="text-red-500">{res.data.message}</p>, {
        description: dateTime,
      });
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      className="w-full sm:w-auto mr-2"
      onClick={handleLogout}
      variant="destructive"
    >
      ออกจากระบบ
    </Button>
  );
});

LogoutButton.displayName = "LogoutButton";

export default LogoutButton;
