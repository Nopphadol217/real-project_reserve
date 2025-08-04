import axios from "@/utils/axiosInstance";

// อัปโหลดข้อมูลการชำระเงิน
export const uploadPaymentInfoAPI = async (placeId, paymentData) => {
  const formData = new FormData();

  formData.append("placeId", placeId);
  formData.append("accountName", paymentData.accountName);
  formData.append("bankName", paymentData.bankName);
  formData.append("accountNumber", paymentData.accountNumber);

  if (paymentData.qrCodeFile) {
    formData.append("qrCode", paymentData.qrCodeFile);
  }

  return await axios.post("/payment/upload-info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ดึงข้อมูลการชำระเงินของ place
export const getPaymentInfoAPI = async (placeId) => {
  return await axios.get(`/payment/info/${placeId}`);
};

// อัปเดตข้อมูลการชำระเงิน
export const updatePaymentInfoAPI = async (placeId, paymentData) => {
  const formData = new FormData();

  formData.append("accountName", paymentData.accountName);
  formData.append("bankName", paymentData.bankName);
  formData.append("accountNumber", paymentData.accountNumber);

  if (paymentData.qrCodeFile) {
    formData.append("qrCode", paymentData.qrCodeFile);
  }

  return await axios.put(`/payment/update/${placeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ลบข้อมูลการชำระเงิน
export const deletePaymentInfoAPI = async (placeId) => {
  return await axios.delete(`/payment/delete/${placeId}`);
};

// อัปโหลดสลิปการโอนเงิน (สำหรับลูกค้า)
export const uploadPaymentSlipAPI = async (bookingId, slipFile) => {
  const formData = new FormData();
  formData.append("paymentSlip", slipFile);

  return await axios.post(`/payment/upload-slip/${bookingId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ยืนยันการชำระเงิน (สำหรับ admin)
export const confirmPaymentAPI = async (bookingId) => {
  return await axios.put(`/payment/confirm/${bookingId}`);
};

// ปฏิเสธการชำระเงิน (สำหรับ admin)
export const rejectPaymentAPI = async (bookingId, reason) => {
  return await axios.put(`/payment/reject/${bookingId}`, { reason });
};

// ดึงรายการการจองที่รอการยืนยันการชำระเงิน (สำหรับ admin)
export const getPendingPaymentsAPI = async () => {
  return await axios.get("/payment/pending");
};

// ดึงรายการการจองทั้งหมดพร้อมสถานะการชำระเงิน (สำหรับ admin)
export const getAllBookingsWithPaymentAPI = async () => {
  return await axios.get("/payment/bookings");
};
