import { MapContainer } from "react-leaflet";
import { Card } from "../ui/card";
import Layers from "./Layers";

const MapHome = () => {
  return (
    <div className="my-3">


      <MapContainer
        className="h-[60vh] rounded-md z-0"
        center={[15, 100]}
        zoom={5}
        crollWheelZoom={true}
      >
        <Layers />
      </MapContainer>
    </div>
  );
};
export default MapHome;
