import usePlaceStore from "@/store/usePlaceStore";
import HeroSection1 from "../hero/HeroSection1";
import PlaceList from "./placeList";
import PlaceCard from "../card/PlaceCard";
import { useEffect, useState } from "react";
import MapHome from "../map/MapHome";
import { categories } from "@/utils/categories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid3X3, List } from "lucide-react";

const PlaceHomeContainer = () => {
  const actionPlaces = usePlaceStore((state) => state.actionListPlace);
  const places = usePlaceStore((state) => state.places);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid หรือ bento
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    actionPlaces();
  }, []);

  // Filter places based on search and category
  useEffect(() => {
    let filtered = places;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (place) =>
          place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (place) => place.category === selectedCategory
      );
    }

    setFilteredPlaces(filtered);
  }, [places, searchTerm, selectedCategory]);

  useEffect(() => {
    actionPlaces();
  }, []);

  // Filter places based on search and category
  useEffect(() => {
    let filtered = places;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (place) =>
          place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (place) => place.category === selectedCategory
      );
    }

    setFilteredPlaces(filtered);
  }, [places, searchTerm, selectedCategory]);

  // Bento Grid Layout Component
  const BentoGrid = ({ places }) => {
    if (places.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">ไม่มีที่พักที่ตรงตามเงื่อนไขการค้นหา</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
        {places.slice(0, 6).map((place, index) => {
          // กำหนดขนาดของแต่ละ card ตาม pattern
          let gridClass = "";
          switch (index) {
            case 0:
              gridClass = "md:col-span-2 md:row-span-2"; // Big card
              break;
            case 1:
              gridClass = "md:col-span-1 md:row-span-1"; // Small card
              break;
            case 2:
              gridClass = "md:col-span-1 md:row-span-1"; // Small card
              break;
            case 3:
              gridClass = "md:col-span-1 md:row-span-1"; // Small card
              break;
            case 4:
              gridClass = "md:col-span-1 md:row-span-1"; // Small card
              break;
            case 5:
              gridClass = "md:col-span-2 md:row-span-1"; // Wide card
              break;
            default:
              gridClass = "md:col-span-1 md:row-span-1";
          }

          return (
            <Card
              key={place.id}
              className={`${gridClass} relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300`}
              onClick={() => (window.location.href = `/place/${place.id}`)}
            >
              <div className="absolute inset-0">
                <img
                  src={place.secure_url}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
                    {place.category}
                  </span>
                </div>
                <h3
                  className={`font-bold mb-1 ${
                    index === 0 ? "text-xl" : "text-sm"
                  }`}
                >
                  {place.title}
                </h3>
                <p
                  className={`text-white/80 mb-2 ${
                    index === 0 ? "text-sm" : "text-xs"
                  } line-clamp-2`}
                >
                  {place.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      index === 0 ? "text-lg" : "text-sm"
                    }`}
                  >
                    ฿{place.price?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs text-white/60">ต่อคืน</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div>
        <HeroSection1 />
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ค้นหาที่พัก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              เลือกประเภทที่พัก
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-6 py-2 transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2"
                    : "hover:bg-gray-50"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                ทั้งหมด
              </Button>

              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.label;

                return (
                  <Button
                    key={category.label}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.label)}
                    className={`rounded-full px-4 py-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2 transform scale-105"
                        : "hover:bg-gray-50 hover:scale-105"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === "bento" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("bento")}
              className="rounded-lg"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Bento Grid
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-lg"
            >
              <List className="w-4 h-4 mr-2" />
              รายการ
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory === "all"
              ? "ที่พักทั้งหมด"
              : `ที่พักประเภท ${selectedCategory}`}
          </h2>
          <p className="text-gray-600">
            พบ {filteredPlaces.length} ที่พัก
            {searchTerm && ` สำหรับคำค้นหา "${searchTerm}"`}
          </p>
        </div>

        {viewMode === "bento" ? (
          <BentoGrid places={filteredPlaces} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredPlaces.map((place) => (
              <PlaceCard key={place.id} places={place} />
            ))}
          </div>
        )}

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่พบที่พักที่ค้นหา
            </h3>
            <p className="text-gray-600 mb-4">
              ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดู
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
            >
              รีเซ็ตการค้นหา
            </Button>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              แผนที่ที่พัก
            </h2>
            <p className="text-gray-600">
              สำรวจที่พักในแต่ละพื้นที่ผ่านแผนที่
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <MapHome places={filteredPlaces} />
          </div>
        </div>
      </div>
    </>
  );
};
export default PlaceHomeContainer;
