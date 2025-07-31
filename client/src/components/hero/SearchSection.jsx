import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";

function SearchSection() {
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Search data:", searchData);
    // Handle search functionality here
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Search Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
              สถานที่
            </label>
            <input
              type="text"
              placeholder="ค้นหาสถานที่..."
              value={searchData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Check In */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-red-500" />
              เช็คอิน
            </label>
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Check Out */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-red-500" />
              เช็คเอาท์
            </label>
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => handleInputChange("checkOut", e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-red-500" />
              ผู้เข้าพัก
            </label>
            <select
              value={searchData.guests}
              onChange={(e) =>
                handleInputChange("guests", parseInt(e.target.value))
              }
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} คน
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 
                     text-white px-8 py-3 rounded-xl font-semibold text-sm
                     transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Search className="w-5 h-5" />
            <span>ค้นหาที่พัก</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {["โรงแรม", "รีสอร์ท", "คอนโด", "บ้านพัก", "โฮสเทล"].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 
                     hover:border-red-300 hover:text-red-600 transition-colors duration-200"
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchSection;
