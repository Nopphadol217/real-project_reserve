import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Filter,
  Users,
  Bath,
  Bed,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SearchMap from "@/components/map/SearchMap";
import usePlaceStore from "@/store/usePlaceStore";
import { categories } from "@/utils/categories";
import useAuthStore from "@/store/useAuthStore";

const SearchPlaces = () => {
  const places = usePlaceStore((state) => state.places);
  const actionListPlace = usePlaceStore((state) => state.actionListPlace);
  const user = useAuthStore((state) => state.user);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.7563, 100.5018]); // Bangkok center

  const [searchFilters, setSearchFilters] = useState({
    searchTerm: "",
    guests: 1,
    category: "all",
    minPrice: "",
    maxPrice: "",
  });

  // Load places on component mount
  useEffect(() => {
    actionListPlace(user?.id);
  }, [actionListPlace, user?.id]);

  // Update filtered places when places or filters change
  useEffect(() => {
    if (places) {
      let filtered = [...places];

      // Filter by search term
      if (searchFilters.searchTerm.trim()) {
        filtered = filtered.filter(
          (place) =>
            place.title
              ?.toLowerCase()
              .includes(searchFilters.searchTerm.toLowerCase()) ||
            place.description
              ?.toLowerCase()
              .includes(searchFilters.searchTerm.toLowerCase()) ||
            place.address
              ?.toLowerCase()
              .includes(searchFilters.searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (searchFilters.category && searchFilters.category !== "all") {
        filtered = filtered.filter((place) => {
          // ค้นหา category object จาก categories array
          const categoryObj = categories.find(
            (cat) => cat.value === searchFilters.category
          );
          if (!categoryObj) return false;

          // เปรียบเทียบทั้ง value และ label กับ place.category
          const placeCategory = place.category?.toLowerCase() || "";
          return (
            placeCategory === categoryObj.value.toLowerCase() ||
            placeCategory === categoryObj.label.toLowerCase()
          );
        });
      }

      // Filter by price range
      if (searchFilters.minPrice) {
        filtered = filtered.filter(
          (place) => place.price >= parseInt(searchFilters.minPrice)
        );
      }
      if (searchFilters.maxPrice) {
        filtered = filtered.filter(
          (place) => place.price <= parseInt(searchFilters.maxPrice)
        );
      }

      // Filter by guests (assuming rooms count as capacity)
      if (searchFilters.guests > 1) {
        filtered = filtered.filter(
          (place) => place.rooms >= searchFilters.guests
        );
      }

      setFilteredPlaces(filtered);

      // Update map center if places found
      if (filtered.length > 0 && filtered[0].lat && filtered[0].lng) {
        setMapCenter([filtered[0].lat, filtered[0].lng]);
      }
    }
  }, [places, searchFilters]);

  const handleSearchChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    console.log("Search filters:", searchFilters);
    console.log("Filtered places:", filteredPlaces);
  };

  const handleMapMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  const clearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      category: "all",
      minPrice: "",
      maxPrice: "",
    });
    setSelectedPlace(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ค้นหาที่พัก</h1>
              <p className="text-sm text-gray-600 mt-1">
                พบ {filteredPlaces.length} ที่พักจากทั้งหมด{" "}
                {places?.length || 0} ที่พัก
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              ล้างตัวกรอง
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Panel - Filters & Results */}
          <div className="flex flex-col space-y-4">
            {/* Search Filters */}
            <Card className="flex-shrink-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="w-5 h-5" />
                  ค้นหาและกรองข้อมูล
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Term */}
                <div>
                  <Label htmlFor="searchTerm">ค้นหา</Label>
                  <Input
                    id="searchTerm"
                    placeholder="ชื่อที่พัก หรือรายละเอียด..."
                    value={searchFilters.searchTerm}
                    onChange={(e) =>
                      handleSearchChange("searchTerm", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

               

                {/* Category & Price Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">ประเภทที่พัก</Label>
                    <Select
                      value={searchFilters.category}
                      onValueChange={(value) =>
                        handleSearchChange("category", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="เลือกประเภท" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทุกประเภท</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="minPrice">ราคาต่ำสุด (บาท/คืน)</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={searchFilters.minPrice}
                      onChange={(e) =>
                        handleSearchChange("minPrice", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice">ราคาสูงสุด (บาท/คืน)</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="ไม่จำกัด"
                      value={searchFilters.maxPrice}
                      onChange={(e) =>
                        handleSearchChange("maxPrice", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <Label className="text-sm font-medium">ประเภทที่พัก</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {/* All Categories Button */}
                    <div
                      className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                        searchFilters.category === "all"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSearchChange("category", "all")}
                    >
                      <Label className="text-xs cursor-pointer">
                        ทุกประเภท
                      </Label>
                    </div>

                    {categories.map((category) => (
                      <div
                        key={category.value}
                        className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                          searchFilters.category === category.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() =>
                          handleSearchChange("category", category.value)
                        }
                      >
                        <Label className="text-xs cursor-pointer">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา ({filteredPlaces.length} ผลลัพธ์)
                </Button>
              </CardContent>
            </Card>

            {/* Search Results */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto pr-2">
                {filteredPlaces.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <Search className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ไม่พบที่พักที่ตรงกับการค้นหา
                      </h3>
                      <p className="text-gray-600 text-center">
                        ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือล้างตัวกรองเพื่อดูทั้งหมด
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map((place) => (
                      <Card
                        key={place.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedPlace?.id === place.id
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : ""
                        }`}
                        onClick={() => setSelectedPlace(place)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-3">
                            {place.secure_url && (
                              <img
                                src={place.secure_url}
                                alt={place.title}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                  {place.title}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {place.category}
                                </Badge>
                              </div>

                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {place.description}
                              </p>

                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" />
                                  <span>{place.rooms} ห้อง</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>สูงสุด {place.rooms * 2} คน</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4 text-green-600" />
                                  <span className="font-bold text-lg text-green-600">
                                    ฿{place.price?.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    /คืน
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/place/${place.id}`, "_blank");
                                  }}
                                >
                                  ดูรายละเอียด
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Map */}
          <div className="order-first xl:order-last">
            <Card className="h-[400px] xl:h-[600px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  แผนที่
                  {selectedPlace && (
                    <Badge variant="default" className="ml-2 max-w-32 truncate">
                      {selectedPlace.title}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <SearchMap
                  places={filteredPlaces}
                  center={mapCenter}
                  zoom={7}
                  selectedPlace={selectedPlace}
                  onMarkerClick={handleMapMarkerClick}
                  height="100%"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPlaces;
