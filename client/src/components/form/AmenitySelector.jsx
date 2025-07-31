import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Utensils,
  Laptop,
  Trees,
  Waves,
  Shield,
} from "lucide-react";

const AmenitySelector = ({
  initialAmenities = [],
  value = [],
  onChange,
  errors,
}) => {
  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    // ใช้ value ก่อน ถ้าไม่มีใช้ initialAmenities
    return value.length > 0 ? value : initialAmenities;
  });

  // รายการสิ่งอำนวยความสะดวก
  const amenitiesList = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "parking", label: "ที่จอดรถ", icon: Car },
    { id: "kitchen", label: "ห้องครัว", icon: Utensils },
    { id: "workspace", label: "พื้นที่ทำงาน", icon: Laptop },
    { id: "tv", label: "ทีวี", icon: Tv },
    { id: "aircon", label: "เครื่องปรับอากาศ", icon: Wind },
    { id: "coffee", label: "เครื่องชงกาแฟ", icon: Coffee },
    { id: "garden", label: "สวน", icon: Trees },
    { id: "pool", label: "สระว่ายน้ำ", icon: Waves },
    { id: "security", label: "รปภ.24 ชม.", icon: Shield },
  ];

  // อัปเดตเมื่อ value prop เปลี่ยน (จาก parent) - แก้ไข infinite loop
  useEffect(() => {
    if (value && Array.isArray(value)) {
      // เปรียบเทียบ array โดยตรงแทนการใช้ JSON.stringify
      const hasChanged =
        value.length !== selectedAmenities.length ||
        value.some((item) => !selectedAmenities.includes(item)) ||
        selectedAmenities.some((item) => !value.includes(item));

      if (hasChanged) {
        setSelectedAmenities(value);
      }
    }
  }, [value]); // ลบ selectedAmenities ออกจาก dependencies

  // ฟังก์ชั่นจัดการ amenities
  const handleAmenityChange = useCallback(
    (amenityId, checked) => {
      setSelectedAmenities((prev) => {
        let newAmenities;
        if (checked) {
          newAmenities = [...prev, amenityId];
        } else {
          newAmenities = prev.filter((id) => id !== amenityId);
        }

        // ส่งข้อมูลกลับไปยัง parent component
        if (onChange) {
          onChange(newAmenities);
        }

        return newAmenities;
      });
    },
    [onChange]
  );

  return (
    <div className="mt-6">
      <Label className="text-sm font-medium text-gray-700 mb-4 block">
        สิ่งอำนวยความสะดวก
      </Label>
      {errors && <p className="text-red-500 text-xs mb-2">{errors}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {amenitiesList.map((amenity) => {
          const IconComponent = amenity.icon;
          const isChecked = selectedAmenities.includes(amenity.id);

          return (
            <div
              key={amenity.id}
              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                isChecked ? "border-red-500 bg-red-50" : "border-gray-200"
              }`}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleAmenityChange(amenity.id, checked)
                }
              />
              <IconComponent className="w-4 h-4 text-gray-600" />
              <Label
                className="text-sm font-medium cursor-pointer"
                onClick={() => handleAmenityChange(amenity.id, !isChecked)}
              >
                {amenity.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitySelector;
