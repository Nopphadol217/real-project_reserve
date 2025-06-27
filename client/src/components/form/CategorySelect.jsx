import { categories } from "@/utils/categories";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
function CategorySelect({ register, name, setValue, label, value }) {
  return (
    <div className="my-4">
      <input hidden {...register(name)} />
      <Label className="capitalize ">{label}</Label>
      <Select required onValueChange={(value) => setValue(name, value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category"  />
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
  );
}
export default CategorySelect;
