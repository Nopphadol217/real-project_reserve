import usePlaceStore from "@/store/usePlaceStore";
import PlaceCard from "../card/PlaceCard";

const PlaceList = () => {
  const places = usePlaceStore((state) => state.places);

  return (
    <article
      className="
  
      sm:px-8 lg:px-8 xl:px-10
      py-8 
      grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5
    "
    >
      {places.map((item) => {
        return <PlaceCard key={item.id} places={item} />;
      })}
    </article>
  );
};
export default PlaceList;
