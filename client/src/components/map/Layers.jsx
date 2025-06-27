import {
  LayersControl,
  Popup,
  TileLayer,
  Marker,
  LayerGroup,
  Tooltip,
  
} from "react-leaflet";

function Layers() {
  return (
    <LayersControl>


      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
     

    </LayersControl>
  )
}
export default Layers