import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Download,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Home,
} from "lucide-react";

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    // Implement PDF download
    console.log("Download PDF for booking:", bookingId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <Card className="text-center p-8 mb-8 bg-green-50 border-green-200">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            การจองสำเร็จ!
          </h1>
          <p className="text-green-700 mb-4">ขอบคุณสำหรับการจองที่พักกับเรา</p>
          <p className="text-sm text-green-600">
            รหัสการจอง:{" "}
            <span className="font-mono font-bold">#{bookingId}</span>
          </p>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ขั้นตอนต่อไป</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium">ได้รับอีเมลยืนยัน</h3>
                <p className="text-sm text-gray-600">
                  เราได้ส่งอีเมลยืนยันการจองไปยังที่อยู่อีเมลของคุณแล้ว
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium">เตรียมตัวสำหรับการเดินทาง</h3>
                <p className="text-sm text-gray-600">
                  กรุณาแสดงใบยืนยันการจองเมื่อเช็คอิน
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium">ติดต่อเจ้าของที่พัก</h3>
                <p className="text-sm text-gray-600">
                  หากมีคำถาม สามารถติดต่อเจ้าของที่พักได้โดยตรง
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ข้อมูลติดต่อ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">โทรศัพท์</p>
                <p className="text-sm text-gray-600">02-xxx-xxxx</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">อีเมล</p>
                <p className="text-sm text-gray-600">support@booking.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleDownloadPDF}
            className="w-full"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลดใบยืนยันการจอง
          </Button>

          <Button
            onClick={() => navigate("/user/bookings")}
            className="w-full"
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            ดูการจองทั้งหมด
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="w-4 h-4 mr-2" />
            กลับหน้าหลัก
          </Button>
        </div>

        {/* Important Notes */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <h3 className="font-medium text-yellow-900 mb-2">ข้อมูลสำคัญ</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• กรุณาเช็คอินหลัง 15:00 น. และเช็คเอาท์ก่อน 11:00 น.</li>
              <li>• การยกเลิกฟรีภายใน 24 ชั่วโมงหลังจากจอง</li>
              <li>• กรุณานำบัตรประชาชนมาแสดงเมื่อเช็คอิน</li>
              <li>• ห้ามสูบบุหรี่ในห้องพัก</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingSuccess;
