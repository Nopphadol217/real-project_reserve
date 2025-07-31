import usePlaceStore from "@/store/usePlaceStore";
import PlaceCard from "../card/PlaceCard";

const PlaceList = () => {
  const places = usePlaceStore((state) => state.places);

  return (
    <article
      className="
  
    
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
