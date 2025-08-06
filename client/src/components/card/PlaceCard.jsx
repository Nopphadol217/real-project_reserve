import { Card } from "../ui/card";
import { Link } from "react-router";
import { Bed, Users, Wifi, Car, Coffee } from "lucide-react";

function PlaceCard({ places }) {
  const {
    id,
    title,
    price,
    description,
    lat,
    lng,
    category,
    secure_url,
    rooms,
    amenities,
    roomDetails,
  } = places;

  // คำนวณราคาเริ่มต้น (ถูกที่สุด)
  const getMinPrice = () => {
    if (roomDetails && roomDetails.length > 0) {
      return Math.min(...roomDetails.map((room) => room.price));
    }
    return price || 0;
  };

  const displayPrice = getMinPrice();
  const hasMultipleRooms = roomDetails && roomDetails.length > 1;

  return (
    <div className="w-full h-full max-w-sm mx-auto">
      <Card
        className="
        w-full h-[400px]
        flex flex-col
        rounded-2xl overflow-hidden 
        shadow-sm hover:shadow-lg
        transition-all duration-300 
        bg-white
        border-0
        transform hover:-translate-y-2
        hover:scale-[1.02]
        group
      "
      >
        {/* Image Section - Fixed Height */}
        <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
          <img
            src={secure_url}
            alt={title || "Place Image"}
            className="w-full h-full object-cover 
                     transition-transform duration-700 
                     group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Category Badge - Modern */}
          {category && (
            <div
              className="absolute top-2 left-2 
                          bg-white/90 backdrop-blur-md text-gray-800 
                          text-xs font-medium px-2.5 py-1 rounded-full
                          shadow-lg border border-white/20"
            >
              {category}
            </div>
          )}
        </div>

        {/* Content Section - Fixed Height with Flex Layout */}
        <div className="flex flex-col justify-between p-3 h-52">
          {/* Title & Price Row */}
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-sm font-semibold text-gray-900 
                         line-clamp-2 leading-tight flex-1 mr-2"
            >
              {title || "ไม่มีชื่อ"}
            </h3>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-bold text-gray-900">
                ฿{displayPrice?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-500">
                ต่อคืน{hasMultipleRooms ? " เริ่มต้น" : ""}
              </div>
            </div>
          </div>

          {/* Description - Fixed Height */}
          <p
            className="text-xs text-gray-600 mb-2
                       line-clamp-2 leading-relaxed h-8"
          >
            {description || "ไม่มีคำอธิบาย"}
          </p>

          {/* Room and Amenities Info */}
          <div className="flex items-center justify-between mb-3">
            {/* Room Info */}
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Bed className="w-3 h-3" />
              <span>{rooms || roomDetails?.length || 1} ห้อง</span>
            </div>

            {/* Top Amenities (show first 3) */}
            {amenities && amenities.length > 0 && (
              <div className="flex items-center space-x-1">
                {amenities.slice(0, 3).map((amenityId) => {
                  const iconMap = {
                    wifi: Wifi,
                    parking: Car,
                    kitchen: Coffee,
                  };
                  const IconComponent = iconMap[amenityId];

                  return IconComponent ? (
                    <IconComponent
                      key={amenityId}
                      className="w-3 h-3 text-gray-400"
                    />
                  ) : null;
                })}
                {amenities.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{amenities.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Button - Always at Bottom */}
          <Link
            to={`/place/${id}`}
            className="
              w-full bg-gray-900 hover:bg-gray-800
              text-white py-2 rounded-xl 
              font-medium text-sm
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              block text-center
              group mt-auto
            "
          >
            <span className="flex items-center justify-center space-x-1.5">
              <span>ดูรายละเอียด</span>
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default PlaceCard;
