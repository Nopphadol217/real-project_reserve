import { toast } from "sonner";

export const toastAlert = (success, message, isFavorite, name) => {
  if (success) {
    if (isFavorite) {
      // Remove from favorites
      toast.success(`ลบ "${name}" ออกจากรายการโปรดแล้ว`, {
        description: "คุณสามารถเพิ่มกลับได้ตลอดเวลา",
        action: {
          label: "ดูรายการโปรด",
          onClick: () => (window.location.href = "/user/favorites"),
        },
      });
    } else {
      // Add to favorites
      toast.success(`เพิ่ม "${name}" ไปยังรายการโปรดแล้ว`, {
        description: "คุณสามารถดูรายการโปรดได้ในหน้าโปรไฟล์",
        action: {
          label: "ดูรายการโปรด",
          onClick: () => (window.location.href = "/user/favorites"),
        },
      });
    }
  } else {
    toast.error(message || "เกิดข้อผิดพลาด");
  }
};
