import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Grid3X3, List, Search } from "lucide-react";
import { Link } from "react-router";
import usePlaceStore from "@/store/usePlaceStore";
import useAuthStore from "@/store/useAuthStore";
import PlaceCard from "@/components/card/PlaceCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const MyFavorites = () => {
  const { user } = useAuthStore();
  const {
    favorites,
    isLoading,
    error,
    actionLoadFavorites,
    actionListFavorite,
    clearError,
  } = usePlaceStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  // โหลด favorites เมื่อ component mount
  useEffect(() => {
    if (user && user.token) {
      actionLoadFavorites(user.token);
    }
  }, [user?.token, actionLoadFavorites]);

  // ฟังก์ชันสำหรับ refresh favorites เมื่อมีการลบ
  const handleFavoriteChange = async () => {
    if (user && user.token) {
      await actionListFavorite(user.token);
    }
  };

  // Filter favorites ตาม search term
  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setFilteredFavorites([]);
      return;
    }

    let filtered = favorites;

    if (searchTerm) {
      filtered = favorites.filter(
        (place) =>
          place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFavorites(filtered);
  }, [favorites, searchTerm]);

  const handleRetry = () => {
    clearError();
    if (user && user.token) {
      actionLoadFavorites(user.token);
    }
  };

  // ถ้าไม่ได้ล็อกอิน
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Heart className="w-6 h-6 text-red-500" />
              รายการโปรดของฉัน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              กรุณาเข้าสู่ระบบเพื่อดูรายการโปรดของคุณ
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/login">
                <Button>เข้าสู่ระบบ</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">กลับหน้าหลัก</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับ
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                รายการโปรดของฉัน
              </h1>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="ค้นหาในรายการโปรด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                เกิดข้อผิดพลาด
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline">
                ลองใหม่อีกครั้ง
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!favorites || favorites.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ยังไม่มีรายการโปรด
              </h3>
              <p className="text-gray-600 mb-4">
                เริ่มเพิ่มที่พักที่คุณชื่นชอบเพื่อดูได้ง่ายขึ้น
              </p>
              <Link to="/">
                <Button>ค้นหาที่พัก</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* No Search Results */}
        {!isLoading &&
          !error &&
          searchTerm &&
          filteredFavorites.length === 0 &&
          favorites &&
          favorites.length > 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  ไม่พบผลลัพธ์
                </h3>
                <p className="text-gray-600 mb-4">
                  ไม่พบที่พักที่ตรงกับการค้นหา "{searchTerm}"
                </p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  แสดงทั้งหมด
                </Button>
              </CardContent>
            </Card>
          )}

        {/* Results Summary */}
        {!isLoading && !error && filteredFavorites.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              {searchTerm
                ? `พบ ${filteredFavorites.length} รายการจาก "${searchTerm}"`
                : `รายการโปรดทั้งหมด ${filteredFavorites.length} รายการ`}
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && !error && filteredFavorites.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {filteredFavorites.map((place) => (
              <PlaceCard
                key={place.id}
                places={{
                  ...place,
                  isFavorite: true, // ใน favorites page ควรเป็น true เสมอ
                }}
                onFavoriteRemoved={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;
