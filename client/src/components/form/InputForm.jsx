import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function InputForm({
  register,
  name,
  label,
  type,
  placeholder,
  errors,
  min,
  max,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-6">
      <Label className="capitalize">{label}</Label>
      <div className="relative">
        <Input
          {...register(name)}
          name={name}
          type={inputType}
          placeholder={placeholder}
          min={min}
          max={max}
          className={`${errors[name] && "border-red-600"} ${
            isPasswordField ? "pr-10" : ""
          }`}
          required
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {errors[name]?.message && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
export default InputForm;
