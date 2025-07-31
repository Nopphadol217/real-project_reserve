import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/utils/categories";

function EditCategorySelect({ register, name, setValue, label, value, error }) {
  const handleValueChange = (selectedValue) => {
    if (setValue && typeof setValue === "function") {
      setValue(name, selectedValue);
    }
  };

  return (
    <div>
      <div className="my-4">
        <input hidden {...register(name)} />
        <Label className="capitalize">{label}</Label>
        <Select required onValueChange={handleValueChange} defaultValue={value}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                value ? `ประเภท ที่เลือกไว้คือ ${value}` : "เลือกประเภทที่พัก"
              }
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
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}
export default EditCategorySelect;
