import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const RoomStatusBadge = ({
  status,
  isAvailable = true,
  size = "sm",
  showIcon = true,
  className = "",
}) => {
  const getStatusConfig = () => {
    if (!isAvailable || status) {
      return {
        label: "ไม่ว่าง",
        variant: "destructive",
        icon: <XCircle className="w-3 h-3" />,
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      };
    }

    return {
      label: "ว่าง",
      variant: "success",
      icon: <CheckCircle className="w-3 h-3" />,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    };
  };

  const config = getStatusConfig();

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-1 font-medium",
        config.bgColor,
        config.textColor,
        config.borderColor,
        size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5",
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

// Component สำหรับแสดงสถานะห้องพร้อมข้อมูลการจอง
export const RoomStatusDetail = ({ room, className = "" }) => {
  const hasUpcomingBookings =
    room.upcomingBookings && room.upcomingBookings.length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{room.name}</h4>
        <RoomStatusBadge
          status={room.status}
          isAvailable={!room.isCurrentlyBooked}
        />
      </div>

      <div className="text-sm text-gray-600">
        <p>ราคา: ฿{room.price?.toLocaleString()}/คืน</p>

        {hasUpcomingBookings && (
          <div className="mt-2">
            <p className="font-medium text-red-600 mb-1">
              การจองที่กำลังจะมาถึง:
            </p>
            {room.upcomingBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="text-xs bg-red-50 p-2 rounded border"
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(booking.checkIn).toLocaleDateString("th-TH")} -
                  {new Date(booking.checkOut).toLocaleDateString("th-TH")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStatusBadge;
