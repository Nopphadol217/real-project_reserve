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

function MainMap({ register, location, setValue }) {
  const [position, setPosition] = useState(null);
  const DEFAULT_LOCATION = [15, 100];
  return (
    <div className="my-3">
      <h1 className="font-semibold my-2">ตอนนี้คุณอยู่ที่ไหน</h1>
      {position && (
        <p className="text-sm text-gray-500">
          Coordinates: {position.lat.toFixed(6)} , {position.lng.toFixed(6)}
        </p>
      )}
      <label >กรณีกรอกตำแหน่ง</label>
      <div>
        {register && (
          <>
            <input placeholder="lat" {...register("lat")} />
            <input placeholder="lng" {...register("lng")} />
          </>
        )}
      </div>
      <MapContainer
        className="h-[60vh] rounded-md z-0"
        center={location || DEFAULT_LOCATION}
        zoom={5}
        crollWheelZoom={true}
      >
        {/* ของ แสดง Detail หน้ารายละเอียด */}
        {location && <Marker position={[location]}></Marker>}

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
export default MainMap;
