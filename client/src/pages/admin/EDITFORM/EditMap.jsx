import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ position, setPosition, setValue }) {
  const map = useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng);
      setValue("lat", e.latlng.lat);
      setValue("lng", e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function EditMap({ register, location, lat, lng, setValue }) {
  const [position, setPosition] = useState(null);

  const DEFAULT_LOCATION = [13, 100];
  const normalizedLocation = location
    ? [location.lat, location.lng]
    : DEFAULT_LOCATION;
  return (
    <div className="my-3">
      {register && (
        <>
          <input hidden {...register("lat")} />
          <input hidden {...register("lng")} />
        </>
      )}
      <h1 className="font-semibold my-2">ตอนนี้คุณอยู่ที่ไหน</h1>
      {position && (
        <p className="text-sm text-gray-500">
          Coordinates แก้ไข: {position.lat.toFixed(6)} , {position.lng.toFixed(6)}
        </p>
      )}
      {location && (
        <p className="text-sm text-gray-500">
          Coordinates ล่าสุด: {lat.toFixed(6)} , {lng.toFixed(6)}
        </p>
      )}
      <MapContainer
        className="h-[60vh] w-[80vh] rounded-md z-0"
        center={location || DEFAULT_LOCATION}
        zoom={5}
        crollWheelZoom={true}
      >
        <Marker position={location}></Marker>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          setValue={setValue}
        />
      </MapContainer>
    </div>
  );
}
export default EditMap;
