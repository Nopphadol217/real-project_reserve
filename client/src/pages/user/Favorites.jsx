import React, { useEffect, useState } from "react";
import { Heart, MapPin, Star, Eye, Calendar, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useFavoriteStore from "@/store/useFavoriteStore";
import { useNavigate } from "react-router";
import { formatDate } from "@/utils/formatDate";

const Favorites = () => {
  const navigate = useNavigate();
  const {
    favorites,
    loading,
    error,
    actionListFavorite,
    actionAddOrRemoveFavorite,
  } = useFavoriteStore();

  useEffect(() => {
    actionListFavorite();
  }, [actionListFavorite]);

  const handleRemoveFavorite = async (placeId) => {
    try {
      const result = await actionAddOrRemoveFavorite(placeId, true); // true = remove
      if (result.success) {
        console.log(result.message);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleViewPlace = (placeId) => {
    navigate(`/place/${placeId}`);
  };

  const handleBookNow = (placeId) => {
    navigate(`/place/${placeId}?book=true`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดรายการโปรด...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={actionListFavorite}>ลองใหม่อีกครั้ง</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Favorites</h1>
              <p className="text-gray-600">ที่พักที่ถูกใจไว้ทั้งหมด</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                ยังไม่มีรายการโปรด
              </h2>
              <p className="text-gray-600 mb-6">
                เริ่มเพิ่มที่พักที่คุณชอบไปยังรายการโปรดของคุณ
              </p>
              <Button onClick={() => navigate("/")}>เริ่มค้นหาที่พัก</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        รายการโปรดของฉัน
                      </h3>
                      <p className="text-gray-600">
                        คุณมีที่พักโปรด {favorites.length} แห่ง
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-800"
                  >
                    {favorites.length} รายการ
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card
                  key={favorite.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={
                        favorite.Place?.secure_url || "/placeholder-hotel.jpg"
                      }
                      alt={favorite.Place?.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.placeId)}
                        className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/90 text-gray-800">
                        ฿{favorite.Place?.price?.toLocaleString()}/คืน
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                          {favorite.Place?.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {favorite.Place?.category}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {favorite.Place?.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          เพิ่มเมื่อ {formatDate(favorite.createdAt, "th")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>4.5</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPlace(favorite.placeId)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          ดูรายละเอียด
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBookNow(favorite.placeId)}
                          className="flex-1 bg-pink-600 hover:bg-pink-700"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          จองเลย
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-pink-800 mb-2">
                  💡 เคล็ดลับ
                </h3>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>• คลิก ❤️ ที่การ์ดที่พักเพื่อเพิ่มไปยังรายการโปรด</li>
                  <li>• ที่พักในรายการโปรดจะถูกบันทึกไว้สำหรับการจองในอนาคต</li>
                  <li>
                    • คุณสามารถเปรียบเทียบราคาและสิ่งอำนวยความสะดวกได้ง่าย
                  </li>
                  <li>• ลบรายการที่ไม่ต้องการออกได้ตามต้องการ</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
