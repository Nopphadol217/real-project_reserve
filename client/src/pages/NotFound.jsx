import React from "react";
import { useNavigate } from "react-router";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const goBack = () => {
    navigate(-1);
  };

  const goSearch = () => {
    navigate("/search");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="text-center py-16 px-8">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-red-600 mb-4 leading-none">
              404
            </h1>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ไม่พบหน้าที่คุณค้นหา
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              ขออภัย หน้าที่คุณพยายามเข้าถึงไม่มีอยู่ในระบบ
            </p>
            <p className="text-gray-500">
              อาจจะถูกย้าย ลบ หรือคุณพิมพ์ URL ผิด
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <MapPin className="w-24 h-24 text-red-600" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={goHome}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                กลับสู่หน้าหลัก
              </Button>

              <Button
                onClick={goSearch}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 text-lg"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                ค้นหาที่พัก
              </Button>
            </div>

            <div>
              <Button
                onClick={goBack}
                variant="ghost"
                className="text-gray-600 hover:text-red-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับหน้าก่อนหน้า
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              หากคุณคิดว่านี่เป็นข้อผิดพลาด กรุณาติดต่อทีมสนับสนุน
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ติดต่อเรา
              </a>
              <a
                href="/help"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ช่วยเหลือ
              </a>
              <a
                href="/sitemap"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                แผนผังเว็บไซต์
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
