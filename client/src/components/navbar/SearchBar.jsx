import { Input } from "../ui/input";

function SearchBar() {
  return (
    <div className="max-w-xs w-[250px] m-auto">
      <Input placeholder="Search" className=" bg-white" type="text" />
    </div>
  );
}
export default SearchBar;
