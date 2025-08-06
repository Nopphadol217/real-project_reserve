import { useEffect, useState } from "react";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";
import PaymentMethodSelector from "./PaymentMethodSelector";
import useBookingStore from "@/store/useBookingStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, ArrowLeft } from "lucide-react";

function BookingContainer({
  placeId,
  price,
  bookings,
  paymentInfo,
  selectedRoom,
}) {
  const [step, setStep] = useState(1); // 1: Calendar & Form, 2: Payment Method, 3: Stripe Booking
  const [bookingData, setBookingData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showStripeBooking, setShowStripeBooking] = useState(false);

  useEffect(() => {
    useBookingStore.setState({
      placeId: placeId,
      price: price,
      bookings: bookings,
      selectedRoom: selectedRoom,
    });
  }, [placeId, selectedRoom, price, bookings]);

  const handleBookingSubmit = (data) => {
    setBookingData(data);
    setStep(2); // ไปขั้นตอนเลือกการชำระเงิน
  };

  const handlePaymentMethodSelect = (method) => {
    if (method === "stripe") {
      setStep(3); // ไปขั้นตอน Stripe booking
      setShowStripeBooking(true);
    }
    // สำหรับ bank transfer จะจัดการใน PaymentMethodSelector
  };

  const handleBackToBooking = () => {
    setStep(1);
    setBookingData(null);
    setShowStripeBooking(false);
  };

  const handleBackToPaymentMethod = () => {
    setStep(2);
    setShowStripeBooking(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setStep(1);
    setBookingData(null);
    setShowStripeBooking(false);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Calendar className="w-5 h-5" />
            เลือกวันที่และสรุปการจอง
          </>
        );
      case 2:
        return (
          <>
            <CreditCard className="w-5 h-5" />
            เลือกวิธีการชำระเงิน
          </>
        );
      case 3:
        return (
          <>
            <CreditCard className="w-5 h-5" />
            ยืนยันการจอง (Stripe)
          </>
        );
      default:
        return "จองที่พัก";
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center mb-8">
        <Button
          onClick={() => setIsDialogOpen(true)}
          size="lg"
          className="flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          จองที่พักนี้
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getStepTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <BookingCalendar />
                </div>
                <div className="flex justify-center">
                  <BookingForm onSubmit={handleBookingSubmit} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToBooking}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    กลับไปเลือกวันที่
                  </Button>
                </div>
                <PaymentMethodSelector
                  bookingData={bookingData}
                  paymentInfo={paymentInfo}
                  onBack={handleBackToBooking}
                  onSelectPaymentMethod={handlePaymentMethodSelect}
                />
              </div>
            )}

            {step === 3 && showStripeBooking && (
              <div>
                <div className="mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackToPaymentMethod}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    กลับไปเลือกวิธีชำระเงิน
                  </Button>
                </div>
                <div className="flex justify-center">
                  <BookingForm onSubmit={() => {}} showStripeOnly={true} />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BookingContainer;
