import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Users, Wifi } from "lucide-react";
import FavoriteToggleButton from "./FavoriteToggleButton";
import RoomStatusBadge from "@/components/ui/RoomStatusBadge";
import { Link } from "react-router";

const PlaceCard = ({ places}) => {
  const {
    id,
    title,
    description,
    price,
    category,
    secure_url,
    galleries,
    roomDetails,
    isFavorite = false,
    User,
  } = places;

  // Get main image
  const mainImage =
    secure_url ||
    (galleries && galleries[0]?.secure_url) ||
    "/placeholder-hotel.jpg";

  // Check if any room is available
  const hasAvailableRooms = roomDetails?.some((room) => !room.status) || false;

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="relative">
        {/* Main Image */}
        <Link to={`/place/${id}`}>
          <img
            src={mainImage}
            alt={title}
            className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Favorite Button - Top Right */}
        <div className="absolute top-3 right-3">
          <FavoriteToggleButton
            placeId={id}
            isFavorite={isFavorite}
            name={title}
          />
        </div>

        {/* Price Badge - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 font-semibold">
            ฿{price?.toLocaleString()}/คืน
          </Badge>
        </div>

        {/* Room Status - Bottom Right */}
        {roomDetails && roomDetails.length > 0 && (
          <div className="absolute bottom-3 right-3">
            <RoomStatusBadge
              status={!hasAvailableRooms}
              isAvailable={hasAvailableRooms}
              size="sm"
            />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Category */}
          <div>
            <Link to={`/place/${id}`}>
              <h3 className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
                {title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{category}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{roomDetails?.length || 1} ห้อง</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-4 h-4" />
              <span>Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>

          {/* Host Info */}
          {User && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {User.firstname?.[0] || User.username?.[0] || "H"}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                โดย {User.firstname || User.username}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link
              to={`/place/${id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              ดูรายละเอียด
            </Link>
            <Link
              to={`/place/${id}?book=true`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              จองเลย
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
