import React from "react";

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
        เกี่ยวกับโครงงาน
      </h1>

      {/* Profile Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src="/image/nopphadol.jpg" // เปลี่ยน path เป็นรูปจริงของคุณ
          alt="นพดล สายภักดี"
          className="w-32 h-32 rounded-full object-cover border-4 border-red-500 shadow-md"
        />
        <h2 className="mt-4 text-xl font-semibold">นายนพดล สายภักดี</h2>
        <p className="text-gray-600 text-sm">ผู้พัฒนาโครงงาน</p>
        <p className="text-gray-600 text-sm">
          วิทยาลัยเทคนิคนครสวรรค์ ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.){" "}
        </p>
        <p className="text-gray-600 text-sm">
          แผนกวิชาเทคนิคคอมพิวเตอร์ สาขาวิชา เทคโนโลยีคอมพิวเตอร์
        </p>
      </div>

      {/* Objectives Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-500 border-b pb-2">
          1.2 วัตถุประสงค์ของโครงงาน
        </h2>
        <ul className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            เพื่อออกแบบและพัฒนาระบบเว็บไซต์
            ที่สามารถแสดงข้อมูลที่พักได้อย่างครบถ้วน เช่น รูปภาพ,
            รายละเอียดห้องพัก, สิ่งอำนวยความสะดวก, ราคา
          </li>
          <li>
            เพื่อพัฒนาระบบการค้นหาและฟังก์ชันการจองที่พักออนไลน์ที่ใช้งานง่ายและมีประสิทธิภาพ
            สำหรับผู้ใช้งานทั่วไป
          </li>
          <li>
            เพื่อสร้างระบบบริหารจัดการข้อมูลที่พักและข้อมูลการจอง
            สำหรับผู้ดูแลระบบและผู้ประกอบการที่พัก
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
