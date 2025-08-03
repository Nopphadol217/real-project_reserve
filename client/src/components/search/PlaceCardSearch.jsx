import React from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Heart, Star } from 'lucide-react';

const PlaceCardSearch = ({ place, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  // ฟังก์ชันคำนวณราคาจากห้องที่ถูกที่สุด
  const getPlacePrice = (place) => {
    // ตรวจสอบว่า place มีข้อมูลและ rooms เป็น array
    if (!place || !place.rooms || !Array.isArray(place.rooms) || place.rooms.length === 0) {
      return 'ติดต่อสอบถาม';
    }
    
    // หาราคาที่ต่ำที่สุดจากห้องทั้งหมด
    const prices = place.rooms
      .map(room => parseFloat(room.price) || 0)
      .filter(price => price > 0);
    
    if (prices.length === 0) {
      return 'ติดต่อสอบถาม';
    }
    
    const minPrice = Math.min(...prices);
    return minPrice.toLocaleString();
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg rounded-2xl group" 
      onClick={() => navigate(`/place/${place.id}`)}
    >
      <div className={`${viewMode === 'list' ? 'flex' : 'block'}`}>
        {/* Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'w-full h-48'}`}>
          <img
            src={place.imageUrl || `https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop`}
            alt={place.placeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </Button>
          
          {place.featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg">
              แนะนำ
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-1">
                {place.placeName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                {place.address} • {place.category}
              </p>
              <p className="text-xs text-gray-500 mt-1">{place.province || 'ไทย'}</p>
            </div>
            <div className="text-right ml-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                  4.5
                </div>
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  ดีมาก
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {Math.floor(Math.random() * 500) + 50} รีวิว
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
            {place.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Wi-Fi ฟรี
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              ที่จอดรถ
            </Badge>
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              แอร์
            </Badge>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div>
              <div className="text-xl font-bold text-green-600">
                ฿{getPlacePrice(place)}
              </div>
              <div className="text-xs text-gray-500">ต่อคืน รวมภาษี</div>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/place/${place.id}`);
              }}
            >
              ดูรายละเอียด
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PlaceCardSearch;
