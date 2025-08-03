import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useParams, useLocation, useNavigate } from "react-router";
import { ShieldCheck, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/store/useAuthStore";
import { checkout } from "../../api/bookingAPI";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { id } = useParams(); // bookingId from URL params
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // รับ bookingId จาก URL params หรือ state
  const bookingId = id || location.state?.bookingId;

  const fetchClientSecret = async () => {
    try {
      if (!bookingId) {
        throw new Error("Booking ID not found");
      }

      console.log("Fetching client secret for booking ID:", bookingId);
      const res = await checkout(bookingId);
      console.log("Client secret response:", res);
      return res.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      throw error;
    }
  };

  const options = { fetchClientSecret };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              จำเป็นต้องเข้าสู่ระบบ
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              คุณต้องเข้าสู่ระบบก่อนทำการชำระเงิน
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              เข้าสู่ระบบ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              ไม่พบข้อมูลการจอง
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">กรุณาทำการจองใหม่อีกครั้ง</p>
            <Button onClick={() => navigate("/")} className="w-full">
              กลับหน้าหลัก
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              กลับ
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ชำระเงิน</h1>
                <p className="text-sm text-gray-600">
                  การจองหมายเลข #{bookingId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  ชำระเงินอย่างปลอดภัย
                </CardTitle>
                <p className="text-gray-600">
                  การชำระเงินของคุณได้รับการป้องกันด้วย Stripe
                </p>
              </CardHeader>
              <CardContent>
                <div id="checkout" className="w-full">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Security Info */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Security Badge */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      ความปลอดภัย 100%
                    </h3>
                    <p className="text-sm text-gray-600">
                      ข้อมูลการชำระเงินของคุณได้รับการเข้ารหัสและปกป้องอย่างปลอดภัย
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">วิธีการชำระเงิน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <span className="text-sm">บัตรเครดิต/เดบิต</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                        P
                      </div>
                      <span className="text-sm">PayPal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    ต้องการความช่วยเหลือ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    หากคุณพบปัญหาในการชำระเงิน กรุณาติดต่อทีมสนับสนุนของเรา
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    ติดต่อฝ่ายสนับสนุน
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
