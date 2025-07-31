import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "ชื่อบัญชีต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(30, "ชื่อบัญชีต้องไม่เกิน 30 ตัวอักษร"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .regex(/[a-z]/, "ต้องมีตัวอักษรภาษาอังกฤษตัวเล็กอย่างน้อย 1 ตัว")
      .regex(/[A-Z]/, "ต้องมีตัวอักษรภาษาอังกฤษตัวใหญ่อย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "กรุณากรอกรหัสผ่านอย่างน้อย 6 ตัวอักษร"),
});

// Schema สำหรับการสร้างหรือแก้ไขที่พัก
export const placeSchema = z.object({
  // ข้อมูลพื้นฐานของที่พัก
  title: z
    .string()
    .min(3, { message: "ชื่อที่พักต้องมีความยาวอย่างน้อย 3 ตัวอักษร" })
    .max(100, { message: "ชื่อที่พักต้องมีความยาวไม่เกิน 100 ตัวอักษร" }),

  description: z
    .string()
    .min(10, { message: "รายละเอียดต้องมีความยาวอย่างน้อย 10 ตัวอักษร" })
    .max(1000, { message: "รายละเอียดต้องมีความยาวไม่เกิน 1000 ตัวอักษร" }),

  price: z
    .number({ invalid_type_error: "กรุณาระบุราคาเป็นตัวเลขเท่านั้น" })
    .positive({ message: "ราคาต้องเป็นจำนวนเต็มบวกเท่านั้น" })
    .int({ message: "ราคาต้องเป็นจำนวนเต็มเท่านั้น" })
    .or(
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10))
    )
    .refine((val) => val >= 100, {
      message: "ราคาต้องมากกว่าหรือเท่ากับ 100 บาท",
    }),

  category: z.string().min(1, { message: "กรุณาเลือกประเภทที่พัก" }),

  // พิกัดตำแหน่งบนแผนที่
  lat: z
    .number({ invalid_type_error: "กรุณาเลือกพิกัดบนแผนที่" })
    .or(
      z
        .string()
        .regex(/^-?\d+(\.\d+)?$/)
        .transform((val) => parseFloat(val))
    )
    .refine((val) => val >= -90 && val <= 90, {
      message: "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90",
    }),

  lng: z
    .number({ invalid_type_error: "กรุณาเลือกพิกัดบนแผนที่" })
    .or(
      z
        .string()
        .regex(/^-?\d+(\.\d+)?$/)
        .transform((val) => parseFloat(val))
    )
    .refine((val) => val >= -180 && val <= 180, {
      message: "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180",
    }),

  // รูปภาพหลัก
  mainImage: z.any(),

  // รูปภาพแกลเลอรี่ (เป็น array)
  galleryImages: z
    .array(z.any())
    .refine((files) => files.length > 0, {
      message: "กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป",
    })
    .refine((files) => files.length <= 15, {
      message: "สามารถอัปโหลดรูปภาพได้สูงสุด 15 รูป",
    }),

  // จำนวนห้อง
  rooms: z
    .number({ invalid_type_error: "กรุณาระบุจำนวนห้องเป็นตัวเลขเท่านั้น" })
    .positive({ message: "จำนวนห้องต้องเป็นจำนวนเต็มบวกเท่านั้น" })
    .int({ message: "จำนวนห้องต้องเป็นจำนวนเต็มเท่านั้น" })
    .or(
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10))
    )
    .refine((val) => val >= 1, {
      message: "จำนวนห้องต้องมากกว่าหรือเท่ากับ 1",
    }),

  // สิ่งอำนวยความสะดวก (array of strings)
  amenities: z.array(z.string()).optional(),

  // userId จะถูกเพิ่มในขั้นตอน submit
  userId: z.number().optional(),
});

export const editPlaceSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อที่พัก"),
  description: z.string().optional(), // ถ้าไม่บังคับใส่
  price: z
    .number({ invalid_type_error: "กรุณาระบุราคาเป็นตัวเลขเท่านั้น" })
    .positive({ message: "ราคาต้องเป็นจำนวนเต็มบวกเท่านั้น" })
    .int({ message: "ราคาต้องเป็นจำนวนเต็มเท่านั้น" })
    .or(
      z
        .string()
        .regex(/^\d+$/)
        .transform((val) => parseInt(val, 10))
    )
    .refine((val) => val >= 100, {
      message: "ราคาต้องมากกว่าหรือเท่ากับ 100 บาท",
    }),

  lat: z.number().optional(), // สมมติ user ไม่แก้ไขพิกัด
  lng: z.number().optional(),
  category: z.string().optional(),
  // รูปภาพหลัก
  mainImage: z.any().optional(),
  galleryImages: z.array(z.any()).optional(),
});

// Schema สำหรับอัปเดตโปรไฟล์
export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร")
      .max(20, "ชื่อผู้ใช้ต้องไม่เกิน 20 ตัวอักษร")
      .optional()
      .or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .regex(/[a-z]/, "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    isGoogleUser: z.boolean().optional(), // เพิ่มสำหรับตรวจสอบ Google User
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // ถ้าต้องการเปลี่ยนรหัสผ่าน และไม่ใช่ Google User ต้องใส่รหัสผ่านปัจจุบัน
      if (data.password && !data.isGoogleUser && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "กรุณาใส่รหัสผ่านปัจจุบัน",
      path: ["currentPassword"],
    }
  );
