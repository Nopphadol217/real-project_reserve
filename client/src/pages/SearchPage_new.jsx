import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Star, Users } from "lucide-react";
import PlaceCard from "@/components/card/PlaceCard";
import { searchPlaces, getCategories, getLocations } from "@/api/searchAPI";
import { categories } from "@/utils/categories";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);

  // Form state
  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    location: searchParams.get("location") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Load initial data
  useEffect(() => {
    loadCategories();
    loadLocations();
  }, []);

  // Search when URL params change
  useEffect(() => {
    if (searchParams.toString()) {
      handleSearch();
    }
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setAvailableCategories(response.data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await getLocations();
      setPopularLocations(response.data);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Create search params from current filters
      const searchQuery = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );

      const response = await searchPlaces(searchQuery);
      setResults(response.data.places);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      page: 1,
    });
    setSearchParams({});
    setResults([]);
    setPagination(null);
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ค้นหาที่พักที่ใช่สำหรับคุณ
          </h1>
          <p className="text-gray-600">ค้นพบที่พักสุดพิเศษจากทั่วประเทศไทย</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Query */}
              <div className="lg:col-span-2">
                <Input
                  placeholder="ค้นหาชื่อที่พัก, คำอธิบาย, หรือที่อยู่..."
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Category */}
              <Select
                value={filters.category}
                onValueChange={(value) => updateFilters({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทุกหมวดหมู่</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Range */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="ราคาต่ำสุด"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="ราคาสูงสุด"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                />
              </div>

              {/* Location */}
              <div className="flex gap-2">
                <Input
                  placeholder="สถานที่"
                  value={filters.location}
                  onChange={(e) => updateFilters({ location: e.target.value })}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {Object.entries(filters).some(
              ([key, value]) => key !== "page" && value !== ""
            ) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">ตัวกรอง:</span>
                {filters.query && (
                  <Badge variant="secondary">ค้นหา: {filters.query}</Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary">
                    หมวดหมู่: {getCategoryLabel(filters.category)}
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary">
                    ราคา: {filters.minPrice || "0"} - {filters.maxPrice || "∞"}{" "}
                    บาท
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary">
                    <MapPin className="w-3 h-3 mr-1" />
                    {filters.location}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Locations */}
        {popularLocations.length > 0 && !results.length && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                สถานที่ยอดนิยม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {popularLocations.map((location, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateFilters({ location: location.location })
                    }
                    className="text-sm"
                  >
                    {location.location}
                    <Badge variant="secondary" className="ml-2">
                      {location.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">กำลังค้นหา...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                ผลการค้นหา ({pagination?.totalCount || 0} รายการ)
              </h2>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {results.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  ก่อนหน้า
                </Button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={
                        page === pagination.currentPage ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </>
        ) : searchParams.toString() ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ไม่พบผลการค้นหา
            </h3>
            <p className="text-gray-600 mb-4">
              ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองอื่น ๆ
            </p>
            <Button onClick={clearFilters} variant="outline">
              ล้างตัวกรองทั้งหมด
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              เริ่มต้นค้นหาที่พักของคุณ
            </h3>
            <p className="text-gray-600">
              ใช้ตัวกรองด้านบนเพื่อค้นหาที่พักที่ใช่สำหรับคุณ
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
