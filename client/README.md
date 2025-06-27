# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


📌 Flow ที่วางไว้ตอนแรกสุด
เราวางแผนทำตาม flow ประมาณนี้:

Authentication

[✅] Register / Login

[✅] เก็บ token และ user ลง localStorage + Zustand

[✅] ปรับ Navbar ให้แสดง login/register หรือ profile ตามสถานะ

Profile System

[✅] ดึงข้อมูล profile จาก API

[✅] แสดงข้อมูล user

[✅] Logout

[🔜] Delete Account (ยังไม่ได้ทำ)

Camping Booking System

[⏳] หน้าแสดงรายการแคมป์ทั้งหมด (List)

[⏳] หน้า Camping Detail

[⏳] Image

[⏳] Map

[⏳] Description

[⏳] BookingContainer

[⏳] Booking Flow:

กดจอง → ส่งข้อมูล → เช็ค token → เข้าสู่ Stripe checkout → กลับมาดูสถานะ

ระบบ Payment

[⏳] ใช้ Stripe Checkout

[⏳] Backend สร้าง session และ redirect

[⏳] Webhook หรือ client เช็คสถานะการจ่ายเงิน

แผงผู้ใช้ / Dashboard

[⏳] แสดงรายการที่จอง

[⏳] แก้ไขโปรไฟล์

[⏳] ยกเลิกการจอง


