import usePlaceStore from "@/store/usePlaceStore";
import HeroSection1 from "../hero/HeroSection1";
import PlaceList from "./placeList";
import PlaceCard from "../card/PlaceCard";
import { useEffect, useState } from "react";
import MapHome from "../map/MapHome";
import { categories } from "@/utils/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useAuthStore from "@/store/useAuthStore";

const PlaceHomeContainer = () => {
  const actionPlaces = usePlaceStore((state) => state.actionListPlace);
  const places = usePlaceStore((state) => state.places);
  const isLoading = usePlaceStore((state) => state.isLoading);
  const error = usePlaceStore((state) => state.error);
  const userId = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    const id = userId?.id ?? null;
    // เรียก API ทั้งในกรณีที่มี userId และไม่มี userId
    // เพื่อให้แสดงที่พักได้แม้ไม่ได้ล็อกอิน
    actionPlaces(id);
  }, [userId?.id]);

  // Filter places based on search and category
  useEffect(() => {
    // ตรวจสอบว่า places เป็น array หรือไม่
    if (!Array.isArray(places)) {
      setFilteredPlaces([]);
      return;
    }

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

  return (
    <>
      <div>
        <HeroSection1 />
      </div>

      {/* All Places Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ที่พักทั้งหมด
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              สำรวจที่พักที่หลากหลายจากทั่วประเทศไทย
              พร้อมสิ่งอำนวยความสะดวกครบครัน
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="ค้นหาที่พัก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          </div>

          {/* All Places Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                เกิดข้อผิดพลาดในการโหลดข้อมูล
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => actionPlaces(userId?.id ?? null)}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                ลองใหม่อีกครั้ง
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {(filteredPlaces || []).slice(0, 10).map((place) => (
                <PlaceCard key={place.id} places={place} />
              ))}
            </div>
          )}

          {filteredPlaces && filteredPlaces.length > 10 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="px-8 py-3 border-red-500 text-red-600 hover:bg-red-50"
              >
                ดูเพิ่มเติม ({filteredPlaces.length - 10} ที่พัก)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              เลือกตามประเภทที่พัก
            </h2>
            <p className="text-gray-600">ค้นหาที่พักตามประเภทที่คุณต้องการ</p>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-6 py-2 transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-red-600 text-white ring-2 ring-red-300 ring-offset-2"
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
                      ? "bg-red-600 text-white ring-2 ring-red-300 ring-offset-2 transform scale-105"
                      : "hover:bg-gray-50 hover:scale-105"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Category Results */}
          {categories.map((category) => {
            const categoryPlaces =
              places?.filter((place) => place.category === category.label) ||
              [];

            if (
              selectedCategory !== "all" &&
              selectedCategory !== category.label
            ) {
              return null;
            }

            if (
              selectedCategory === "all" ||
              selectedCategory === category.label
            ) {
              return (
                <div key={category.label} className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <category.icon className="w-6 h-6 text-red-600" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        {category.label}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {categoryPlaces.length} ที่พัก
                      </span>
                    </div>
                    {categoryPlaces.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        ดูทั้งหมด
                      </Button>
                    )}
                  </div>

                  {categoryPlaces.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                      <p className="text-gray-500">ยังไม่มีที่พักในประเภทนี้</p>
                    </div>
                  ) : categoryPlaces.length <= 5 ? (
                    // Normal grid for few items
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                      {categoryPlaces.map((place) => (
                        <PlaceCard key={place.id} places={place} />
                      ))}
                    </div>
                  ) : (
                    // Carousel for many items
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {categoryPlaces.map((place) => (
                          <CarouselItem
                            key={place.id}
                            className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                          >
                            <PlaceCard places={place} />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="hidden md:flex" />
                      <CarouselNext className="hidden md:flex" />
                    </Carousel>
                  )}
                </div>
              );
            }
            return null;
          })}

          {/* No results */}
          {selectedCategory !== "all" &&
            (!filteredPlaces || filteredPlaces.length === 0) && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบที่พักในประเภทที่เลือก
                </h3>
                <p className="text-gray-600 mb-4">
                  ลองเลือกประเภทอื่นหรือดูที่พักทั้งหมด
                </p>
                <Button
                  onClick={() => setSelectedCategory("all")}
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  ดูที่พักทั้งหมด
                </Button>
              </div>
            )}
        </div>
      </div>
    </>
  );
};
export default PlaceHomeContainer;
