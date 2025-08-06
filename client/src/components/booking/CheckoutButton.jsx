import { Button } from "@/components/ui/button";
import { CreditCard, Building2 } from "lucide-react";
import { useState } from "react";
import useBookingStore from "@/store/useBookingStore";
import { toast } from "sonner";

const CheckoutButton = ({
  onStripeCheckout,
  onBankTransferCheckout,
  disabled = false,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const getTotalPrice = useBookingStore((state) => state.getTotalPrice);
  const range = useBookingStore((state) => state.range);

  const total = getTotalPrice();

  const handleStripeCheckout = async () => {
    if (!range?.from || !range?.to) {
      toast.error("กรุณาเลือกวันที่เข้าพักก่อน");
      return;
    }

    if (total <= 0) {
      toast.error("ยอดรวมไม่ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      await onStripeCheckout?.();
    } catch (error) {
      console.error("Stripe checkout error:", error);
      toast.error("เกิดข้อผิดพลาดในการชำระเงินผ่าน Stripe");
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransferCheckout = async () => {
    if (!range?.from || !range?.to) {
      toast.error("กรุณาเลือกวันที่เข้าพักก่อน");
      return;
    }

    if (total <= 0) {
      toast.error("ยอดรวมไม่ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      await onBankTransferCheckout?.();
    } catch (error) {
      console.error("Bank transfer checkout error:", error);
      toast.error("เกิดข้อผิดพลาดในการจองผ่านการโอนธนาคาร");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={handleStripeCheckout}
        disabled={disabled || loading || total <= 0}
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {loading ? "กำลังดำเนินการ..." : "ชำระเงินด้วย Stripe"}
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleBankTransferCheckout}
        disabled={disabled || loading || total <= 0}
      >
        <Building2 className="w-4 h-4 mr-2" />
        ชำระเงินด้วยการโอนธนาคาร
      </Button>

      {total <= 0 && (
        <p className="text-sm text-red-500 text-center">
          กรุณาเลือกวันที่เข้าพักและห้องก่อนทำการจอง
        </p>
      )}
    </div>
  );
};

export default CheckoutButton;
