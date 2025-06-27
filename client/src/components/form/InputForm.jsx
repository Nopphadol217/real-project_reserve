import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";

function InputForm({ register, name,label, type, placeholder, errors }) {
  return (
    <div className="mb-6 ">
      <Label  className="capitalize">
        {label}
      </Label>
      <Input
        {...register(name)}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${errors[name] && "border-red-600"}`}
        required
      />
      {errors[name]?.message && (
        <p className="text-sm text-red-500 absolute left-50 ">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
export default InputForm;
