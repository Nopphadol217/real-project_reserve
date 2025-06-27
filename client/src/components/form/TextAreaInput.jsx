import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

function TextAreaInput({ register, name, type, placeholder, errors }) {
  return (
    <div>
      <Label className="capitalize">{name}</Label>
      <Textarea
        {...register(name)}
        name={name}
        placeholder={placeholder}
        type={type}
        rows={5}
        className={`${errors[name] && "border-red-600"}`}
      />
      {errors[name]?.message && (
        <p className="text-sm text-red-500 absolute left-50 ">
          {errors[name].message}
        </p>
      )}
    </div>
  );
}
export default TextAreaInput;
