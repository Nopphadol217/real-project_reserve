import usePlaceStore from "@/store/usePlaceStore";
import HeroSection1 from "../hero/HeroSection1";
import PlaceList from "./placeList";
import { useEffect } from "react";
import MapHome from "../map/MapHome";

const PlaceHomeContainer = () => {
  const actionPlaces = usePlaceStore((state) => state.actionListPlace);

  useEffect(() => {
    actionPlaces();
  }, []);
  return (
    <>
      <div>

      <HeroSection1 />
      <p>searchbar</p>
      </div>


      <div className="container mx-auto md:mx-[125px] px-4 sm:px-6  py-8">

        <div className="container mx-auto grid grid-cols-12 ">
          <div className="col-span-6 ">
            <MapHome />
          </div>
          <div className="col-span-6">

          </div>
        </div>
 
        <PlaceList />
      </div>
    </>
  );
};
export default PlaceHomeContainer;
