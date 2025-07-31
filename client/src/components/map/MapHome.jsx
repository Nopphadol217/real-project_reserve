import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import usePlaceStore from "@/store/usePlaceStore";
import { Badge } from "../ui/badge";
import { MapPin, DollarSign, Star, Eye } from "lucide-react";
import { Link } from "react-router";
import L from "leaflet";

// Custom marker icon
const createCustomIcon = (color = "#ef4444") => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">🏠</div>
      </div>
    `,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const getCategoryColor = (category) => {
  const colors = {
    resort: "#10b981",
    hotel: "#3b82f6",
    hostel: "#8b5cf6",
    guesthouse: "#f59e0b",
    apartment: "#6366f1",
  };
  return colors[category] || "#ef4444";
};

const MapHome = () => {
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);
  const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]); // Bangkok default

  useEffect(() => {
    actionListPlace();
  }, [actionListPlace]);

  useEffect(() => {
    // Center map based on available places
    if (places.length > 0) {
      const validPlaces = places.filter((place) => place.lat && place.lng);
      if (validPlaces.length > 0) {
        const avgLat =
          validPlaces.reduce((sum, place) => sum + place.lat, 0) /
          validPlaces.length;
        const avgLng =
          validPlaces.reduce((sum, place) => sum + place.lng, 0) /
          validPlaces.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [places]);

  return (
    <div className="my-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">แผนที่ที่พัก</h2>
        <p className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          พบที่พักทั้งหมด {places.length} แห่ง
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg border-0">
        <MapContainer
          className="h-[70vh] w-full z-0"
          center={mapCenter}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: "70vh", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {places.map((place) => {
            // Only show places with valid coordinates
            if (!place.lat || !place.lng) return null;

            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={createCustomIcon(getCategoryColor(place.category))}
              >
                <Popup className="custom-popup" maxWidth={300}>
                  <div className="p-2">
                    {/* Main Image */}
                    <div className="mb-3">
                      {place.secure_url ? (
                        <img
                          src={place.secure_url}
                          alt={place.title}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            ไม่มีรูปภาพ
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Place Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {place.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <Badge
                          className={`text-xs ${
                            place.category === "resort"
                              ? "bg-green-100 text-green-800"
                              : place.category === "hotel"
                              ? "bg-blue-100 text-blue-800"
                              : place.category === "hostel"
                              ? "bg-purple-100 text-purple-800"
                              : place.category === "guesthouse"
                              ? "bg-orange-100 text-orange-800"
                              : place.category === "apartment"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {place.category || "ไม่ระบุ"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-sm">
                            {place.price?.toLocaleString() || 0} ฿
                          </span>
                          <span className="text-gray-500 text-xs ml-1">
                            /คืน
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {place.lat?.toFixed(4)}, {place.lng?.toFixed(4)}
                      </div>

                      {place.description && (
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                          {place.description.length > 80
                            ? `${place.description.substring(0, 80)}...`
                            : place.description}
                        </p>
                      )}

                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/place/${place.id}`}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          ดูรายละเอียด
                        </Link>
                      </div>

                      {/* Gallery indicator */}
                      {place.galleries && place.galleries.length > 0 && (
                        <div className="text-center">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            📸 รูปภาพ {place.galleries.length} รูป
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </Card>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">
          สัญลักษณ์ประเภทที่พัก
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { category: "resort", name: "รีสอร์ท", color: "#10b981" },
            { category: "hotel", name: "โรงแรม", color: "#3b82f6" },
            { category: "hostel", name: "โฮสเทล", color: "#8b5cf6" },
            { category: "guesthouse", name: "เกสต์เฮาส์", color: "#f59e0b" },
            { category: "apartment", name: "อพาร์ทเมนท์", color: "#6366f1" },
          ].map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MapHome;
