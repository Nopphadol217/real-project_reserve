import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MapPin, Star, DollarSign } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SearchMap = ({
  places = [],
  center = [13.7563, 100.5018],
  zoom = 11,
  onMarkerClick,
  selectedPlace,
  height = "500px",
}) => {
  // Create custom icon for selected marker
  const createCustomIcon = (isSelected = false) => {
    return L.divIcon({
      className: `custom-marker ${isSelected ? "selected" : ""}`,
      html: `<div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${isSelected ? "#ef4444" : "#3b82f6"};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  return (
    <div style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(selectedPlace?.id === place.id)}
            eventHandlers={{
              click: () => onMarkerClick && onMarkerClick(place),
            }}
          >
            <Popup>
              <div className="w-64">
                {place.secure_url && (
                  <img
                    src={place.secure_url}
                    alt={place.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold text-lg mb-1">{place.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {place.description}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {place.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {place.rooms} ห้อง
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600">
                      ฿{place.price?.toLocaleString()}/คืน
                    </span>
                  </div>
                  <button
                    onClick={() => window.open(`/place/${place.id}`, "_blank")}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                  >
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SearchMap;
