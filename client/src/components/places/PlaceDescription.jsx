import { Card } from "@/components/ui/card";
import {
  Wifi,
  Car,
  Coffee,
  Bath,
  Bed,
} from "lucide-react";

const Description = ({ place }) => {
  if (!place) {
    return (
      <Card className="p-6 mb-8">
        <p className="text-gray-500">ไม่มีข้อมูลรายละเอียด</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">รายละเอียดที่พัก</h2>
      <p className="text-gray-700 leading-relaxed mb-6">
        {place.description || "ไม่มีคำอธิบาย"}
      </p>


    </Card>
  );
};

export default Description;
