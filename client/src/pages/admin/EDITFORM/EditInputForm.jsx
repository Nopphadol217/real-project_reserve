import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditInputForm({register,name,type,placeholder,value,label,errors}) {
  return (
    <div>
        <Label>{label}</Label>
        <Input 
        {...register(name)}
        name={name}
        placeholder={placeholder}
        defaultValue={value}
        type={type}
        errors={errors}
        className={`${errors[name]} `&& "border-red-500"}
        />
        {errors[name]?.message && (
        <p className="text-sm text-red-500 absolute left-50 ">
          {errors[name].message}
        </p>
      )}
    </div>
  )
}
export default EditInputForm