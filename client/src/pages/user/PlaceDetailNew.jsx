import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { readPlace } from "@/api/createPlaceAPI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainMap from "@/components/map/MainMap";
import BookingContainer from "@/components/booking/BookingContainer";
import BreadCrumbs from "@/components/ui/BreadCrumbs";
import ImageContainer from "@/components/ui/ImageContainer";
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

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchPlaceDetail();
  }, [id]);

  const fetchPlaceDetail = async () => {
    try {
      setLoading(true);
      const response = await readPlace(id);
      const placeData = response.data.result;
      setPlace(placeData);
      setMainImage(placeData.secure_url);
    } catch (error) {
      console.error(error);
      toast.error("ไม่สามารถโหลดข้อมูลที่พักได้");
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreadCrumbs name={place.title} />

        {/* Title and actions */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
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
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
              <Share className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Favorite</span>
            </button>
          </div>
        </header>

        <ImageContainer
          image={place.secure_url}
          name={place.title}
          galleries={place.galleries}
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column - Description & Map */}
          <div className="lg:col-span-8">
            {/* Place Details */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">รายละเอียดที่พัก</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Amenities */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  สิ่งอำนวยความสะดวก
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Wi-Fi ฟรี</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">ที่จอดรถ</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">เครื่องชงกาแฟ</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bath className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">ห้องน้ำส่วนตัว</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bed className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">เตียงขนาดใหญ่</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location */}
            {place.lat && place.lng && (
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
                    <MainMap location={[place.lat, place.lng]} zoom={15} />
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
            )}
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="w-full sticky top-4">
              <Card className="p-6 mb-4">
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      ฿{place.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-1">/ คืน</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      4.8 (124 รีวิว)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  เลือกวันที่จอง
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  ยังไม่เรียกเก็บเงิน
                </p>
              </Card>

              {/* Host Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">เจ้าของที่พัก</h3>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {place.user?.username
                      ? place.user.username.charAt(0).toUpperCase()
                      : "H"}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {place.user?.username || "เจ้าของที่พัก"}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>4.9 • 87 รีวิว</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      ติดต่อเจ้าของที่พัก
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Booking Container (Calendar) */}
              <div className="mt-4">
                <h3 className="text-center text-lg font-medium text-gray-700 mb-4">
                  Calendar
                </h3>
                <BookingContainer
                  place={place}
                  isOpen={showBookingModal}
                  onClose={() => setShowBookingModal(false)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlaceDetail;
