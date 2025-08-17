import usePlaceStore from "@/store/usePlaceStore";
import { useEffect } from "react";
import TabelPlaceList from "./TablePlaceList";


function PlaceContainer() {
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);

  useEffect(() => {
    actionListPlace();

  }, []);

  return (
    <div>
      <TabelPlaceList />
    </div>
  );
}
export default PlaceContainer;
