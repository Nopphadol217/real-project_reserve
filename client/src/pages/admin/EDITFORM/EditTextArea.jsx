import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EditTextArea({ register, name, label, placeholder, value, errors }) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        {...register(name)}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        rows={8}
        className={`${errors}` && "border-red-500"}
      />
      {errors[name]?.massage && (
        <p className="text-red-500 text-sm absolute left-50">
          {errors[name].massage}
        </p>
      )}
    </div>
  );
}
export default EditTextArea;
