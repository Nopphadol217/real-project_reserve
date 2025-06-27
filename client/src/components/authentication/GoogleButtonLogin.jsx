import { googleLoginAPI } from "@/api/authAPI";
import { auth, provider } from "@/lib/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router";
import "boxicons";
import { toast } from "sonner";

function GoogleButtonLogin() {


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ แยกชื่อ
      const nameParts = user.displayName?.trim().split(" ") || [];
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" "); // ชื่อสกุลที่เหลือถ้ามีมากกว่าหนึ่งคำ

      const payload = {
        email: user.email,
        username: user.displayName,
        firstname,
        lastname,
        picture: user.photoURL,
        googleId: user.uid,
      };

      // ส่งไปที่ backend เพื่อ register/login
      const res = await googleLoginAPI(payload);
      // สมมุติว่า backend ส่ง token + user กลับมา
      const { token, user: userData } = res.data;
    
      // set ใน zustand store หรือ localStorage

      // ✅ เพิ่ม redirect ไปหน้า home
      window.location.href = "/";
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  return <Button onClick={handleGoogleLogin}>Login with Google</Button>;
}
export default GoogleButtonLogin;
