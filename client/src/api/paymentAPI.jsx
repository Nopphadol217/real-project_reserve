import axios from "@/utils/axiosInstance";

// อัปโหลด QR Code สำหรับ createListing
export const uploadQRCodeAPI = async (qrCodeData) => {
  return await axios.post("/upload-qr-code", qrCodeData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ลบ QR Code
export const deleteQRCodeAPI = async (public_id) => {
  return await axios.delete("/delete-qr-code", {
    data: { public_id },
  });
};

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

// ดึงข้อมูลการชำระเงินของ place (สำหรับ public access)
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
export const uploadPaymentSlipAPI = async (bookingId, imageData) => {
  // ถ้าเป็น File object ให้แปลงเป็น base64
  if (imageData instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = await axios.post(
            `/payment/upload-slip/${bookingId}`,
            {
              image: reader.result, // ส่งเป็น base64 data URL
              bookingId: bookingId,
            }
          );
          resolve(response);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageData);
    });
  } else {
    // ถ้าเป็น base64 string แล้วให้ส่งตรงๆ
    return await axios.post(`/payment/upload-slip/${bookingId}`, {
      image: imageData, // ส่งเป็น base64 data URL
      bookingId: bookingId,
    });
  }
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

// API สำหรับจัดการข้อมูลการชำระเงินของผู้ประกอบการ (ใหม่)
export const getBusinessPaymentInfoAPI = async () => {
  return await axios.get("/payment/business/info");
};

export const createBusinessPaymentInfoAPI = async (formData) => {
  return await axios.post("/payment/business/info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBusinessPaymentInfoAPI = async (formData) => {
  return await axios.put("/payment/business/info", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBusinessPaymentInfoAPI = async () => {
  return await axios.delete("/payment/business/info");
};
