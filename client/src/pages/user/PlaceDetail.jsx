import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { readPlace } from "@/api/createPlaceAPI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainMap from "@/components/map/MainMap";

import PlaceImageContainer from "@/components/places/PlaceImageContainer";
import PlaceDescription from "@/components/places/PlaceDescription";
import BookingContainer from "@/components/booking/BookingContainer";
import {
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Coffee,
  Heart,
  Share,
  ArrowLeft,
  Calendar,
  Bath,
  Bed,
  Shield,
  Clock,
  Award,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import BreadcrumbForm from "@/components/form/BreadcrumbForm";
import PlaceBreadcrumb from "@/components/places/PlaceBreadcrumb";

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    fetchPlaceDetail();
  }, [id]);

  const fetchPlaceDetail = async () => {
    try {
      setLoading(true);
      const response = await readPlace(id);
      const placeData = response.data.result;
      setPlace(placeData);

      // ตั้งค่าห้องเริ่มต้น (ห้องแรกหรือห้องที่ราคาถูกที่สุด)
      if (placeData.roomDetails && placeData.roomDetails.length > 0) {
        const cheapestRoom = placeData.roomDetails.reduce((prev, current) =>
          prev.price < current.price ? prev : current
        );
        setSelectedRoomId(cheapestRoom.id);
      }
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถโหลดข้อมูลที่พักได้");
    } finally {
      setLoading(false);
    }
  };

  // Calculate number of nights
  const calculateNights = () => {
    return 1;
  };

  const nights = calculateNights();

  // Calculate pricing - ใช้ราคาจากห้องที่เลือก หรือห้องที่ถูกที่สุด
  const getSelectedRoomPrice = () => {
    if (place?.roomDetails && place.roomDetails.length > 0) {
      if (selectedRoomId) {
        const selectedRoom = place.roomDetails.find(
          (room) => room.id === selectedRoomId
        );
        return selectedRoom?.price || place.roomDetails[0].price;
      }
      return Math.min(...place.roomDetails.map((room) => room.price));
    }
    return place?.price || 0;
  };

  const getSelectedRoom = () => {
    if (place?.roomDetails && selectedRoomId) {
      return place.roomDetails.find((room) => room.id === selectedRoomId);
    }
    return null;
  };

  const basePrice = getSelectedRoomPrice();
  const serviceFee = Math.round(basePrice * 0.1);
  const totalPerNight = basePrice * nights;
  const totalPrice = totalPerNight + serviceFee;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ไม่พบข้อมูลที่พัก
          </h2>
          <p className="text-gray-600 mb-4">
            ที่พักที่คุณค้นหาอาจไม่มีอยู่หรือถูกลบไปแล้ว
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            กลับ
          </button>
          <PlaceBreadcrumb name={place.title} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {place.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {place.category} • ละติจูด: {place.lat}, ลองติจูด: {place.lng}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
         
           
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <PlaceImageContainer place={place} />

            {/* Place Details */}
            <PlaceDescription place={place} />

            {/* Room Details Section */}
            {place.roomDetails && place.roomDetails.length > 0 && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ห้องพักที่มีให้บริการ
                </h3>
                <div className="grid gap-4">
                  {place.roomDetails.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Bed className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {room.name}
                          </h4>
                          <p
                            className={`text-sm ${
                              room.status ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {room.status ? "ไม่ว่าง" : "ว่าง"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ฿{room.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">ต่อคืน</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Room Details Section */}
            {place.roomDetails && place.roomDetails.length > 0 && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ห้องพัก ({place.roomDetails.length} ห้อง)
                </h3>
                <div className="space-y-4">
                  {place.roomDetails.map((room, index) => (
                    <div
                      key={room.id}
                      className={`p-4 border rounded-lg transition-all cursor-pointer ${
                        selectedRoomId === room.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedRoomId(room.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {room.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>ห้องพัก</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              <span>เหมาะสำหรับ 2 คน</span>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                room.status
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {room.status ? "ไม่ว่าง" : "ว่าง"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ฿{room.price?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">ต่อคืน</div>
                        </div>
                      </div>
                      {selectedRoomId === room.id && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="flex items-center text-sm text-blue-700">
                            <Award className="w-4 h-4 mr-2" />
                            <span>ห้องที่เลือก</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Amenities Section */}
            {place.amenities && place.amenities.length > 0 && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  สิ่งอำนวยความสะดวก
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {place.amenities.map((amenityId) => {
                    const amenityMap = {
                      wifi: { label: "Wi-Fi", icon: Wifi },
                      parking: { label: "ที่จอดรถ", icon: Car },
                      kitchen: { label: "ห้องครัว", icon: Coffee },
                      workspace: { label: "พื้นที่ทำงาน", icon: Users },
                      tv: { label: "ทีวี", icon: Users },
                      aircon: { label: "เครื่องปรับอากาศ", icon: Users },
                      coffee: { label: "เครื่องชงกาแฟ", icon: Coffee },
                      garden: { label: "สวน", icon: Users },
                      pool: { label: "สระว่ายน้ำ", icon: Bath },
                      security: { label: "รปภ.24 ชม.", icon: Shield },
                    };

                    const amenity = amenityMap[amenityId];
                    if (!amenity) return null;

                    const IconComponent = amenity.icon;

                    return (
                      <div
                        key={amenityId}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {amenity.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Reviews Section */}

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">ที่ตั้งสถานที่</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {place.category} • ละติจูด: {place.lat}, ลองติจูด:{" "}
                    {place.lng}
                  </span>
                </div>

                {/* Interactive Map */}
                <div className="w-full rounded-lg overflow-hidden">
                  {place.lat && place.lng ? (
                    <MainMap location={[place.lat, place.lng]} zoom={15} />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2" />
                        <p>ไม่มีข้อมูลตำแหน่ง</p>
                        <p className="text-sm">ไม่สามารถแสดงแผนที่ได้</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">เกี่ยวกับพื้นที่นี้</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    ตั้งอยู่ในย่านที่เงียบสงบ ใกล้กับแหล่งท่องเที่ยวสำคัญ
                    มีร้านอาหารและร้านสะดวกซื้อใกล้เคียง การเดินทางสะดวก
                    สามารถเข้าถึงได้ง่ายทั้งรถยนต์และขนส่งสาธารณะ
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1 ">
            <Card className="p-6 sticky top-4 flex flex-col justify-center items-center">
              <div className="mb-6 w-full">
                {/* Room Selection Summary */}
                {place?.roomDetails && place.roomDetails.length > 1 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          ห้องที่เลือก:
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {getSelectedRoom()?.name || "เลือกห้อง"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ฿{basePrice?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">ต่อคืน</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Single Room or No Room Details */}
                {(!place?.roomDetails || place.roomDetails.length <= 1) && (
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ฿{basePrice?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/ คืน</span>
                  </div>
                )}

                {/* Booking Section */}
                <BookingContainer
                  placeId={place.id}
                  price={basePrice}
                  selectedRoom={getSelectedRoom()}
                  bookings={[]}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
