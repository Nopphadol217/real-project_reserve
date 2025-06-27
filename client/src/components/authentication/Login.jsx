import { useForm, useFormState } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "../form/InputForm";
import { loginAPI } from "@/api/authAPI";
import { loginSchema } from "@/utils/schemas";
import { Navigate, useNavigate } from "react-router";
import useAuthStore from "@/store/useAuthStore";
import GoogleButtonLogin from "./GoogleButtonLogin";
import { toast } from "sonner";

function Login() {
  const navigate = useNavigate();
  //Zustand

  const hydrate = useAuthStore((state) => state.hydrate);
  //HookForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const dateTime = new Date().toLocaleString();

  const hdlLogin = async (data) => {
    try {
      const res = await loginAPI(data);

      hydrate();
      toast.message(<p className="text-emerald-500">{res.data.message}</p>, {
        description: dateTime,
      });
      if (res.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex justify-center items-center min-h-[80vh] ">
      <Card className="p-10 w-[450px]">
        <form onSubmit={handleSubmit(hdlLogin)} className="space-y-4">
          <div className="flex justify-center my-2">
            <h1 className="text-xl font-semibold">Login</h1>
          </div>
          <InputForm
            register={register}
            name="email"
            type="email"
            label="Email"
            placeholder="m@example.com"
            errors={errors}
          />
          <InputForm
            register={register}
            name="password"
            type="password"
            label="password"
            placeholder="Enter Your Password"
            errors={errors}
          />
          <div className="flex justify-center">
            <Button>เข้าสู่ระบบ</Button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <GoogleButtonLogin />
        </div>
      </Card>
    </div>
  );
}
export default Login;
