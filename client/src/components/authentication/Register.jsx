import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "../form/InputForm";
import { registerSchema } from "@/utils/schemas";
import { registerAPI } from "@/api/authAPI";
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const hdlSubmit = async (data) => {
    try {
      const res = await registerAPI(data);
      navigate("/login");
      console.log(res);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "มี email นี้ในระบบแล้ว"
      ) {
        // set error ให้ field email
        setError("email", {
          type: "server",
          message: "มี email นี้ในระบบแล้ว",
        });
      } else {
        // เผื่อไว้หากเกิด error อื่น
        setError("root", {
          type: "server",
          message: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่",
        });
      }
    }
  };

  return (
    <div className="mt-2 flex justify-center ">
      <Card className="p-10 w-[450px] text-xl">
        <form onSubmit={handleSubmit(hdlSubmit)}>
          <div className="flex justify-center my-2">
            <h1 className="font-semibold">Register</h1>
          </div>
          <InputForm
            register={register}
            name="username"
            type="text"
            label="username"
            placeholder="Enter Your Username"
            errors={errors}
          />
          <InputForm
            register={register}
            name="email"
            type="email"
            label="email"
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
          <InputForm
            register={register}
            name="confirmPassword"
            type="password"
            label="confirm password"
            placeholder="Enter Your Confirm Password"
            errors={errors}
          />
          <Button className="max-w w-[100%]">เข้าสู่ระบบ</Button>
          {/* social Login */}
        </form>
      </Card>
    </div>
  );
}
export default Register;
