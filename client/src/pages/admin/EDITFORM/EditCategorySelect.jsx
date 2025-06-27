import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/utils/categories";

function EditCategorySelect({ register, name, setValue, label, value }) {
  return (
    <div>
      <div className="my-4">
        <input hidden {...register(name)} />
        <Label className="capitalize ">{label}</Label>
        <Select required onValueChange={(value) => setValue(name, value)}>
          <SelectTrigger className="w-full">
            <SelectValue
              
              placeholder={`ประเภท ที่เลือกไว้คือ ${value}`}
            />
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => {
              return (
                <SelectItem value={item.label} key={item.label}>
                  <span className="flex gap-3">
                    <item.icon /> <p className="capitalize">{item.label}</p>
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
export default EditCategorySelect;
