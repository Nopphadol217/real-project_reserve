import {
  FileText,
  Download,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  Star,
  Clock,
  Home,
} from "lucide-react";

const BookingPDF = {
  // Generate PDF data structure
  generatePDFData: (bookingData) => {
    const { place, selectedDate, nights, basePrice, serviceFee, totalPrice } =
      bookingData;

    return {
      title: "ใบยืนยันการจอง - " + place.title,
      bookingId: "BK" + Date.now(),
      timestamp: new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      place: {
        name: place.title,
        category: place.category,
        image: place.secure_url,
        location: `ละติจูด: ${place.lat}, ลองติจูด: ${place.lng}`,
      },
      booking: {
        checkIn: new Date(selectedDate.checkIn).toLocaleDateString("th-TH"),
        checkOut: new Date(selectedDate.checkOut).toLocaleDateString("th-TH"),
        guests: selectedDate.guests,
        nights: nights,
      },
      pricing: {
        basePrice: basePrice,
        totalPerNight: basePrice * nights,
        serviceFee: serviceFee,
        totalPrice: totalPrice,
      },
      terms: [
        "การยกเลิกฟรีภายใน 24 ชั่วโมง",
        "ชำระเงินหลังจากยืนยันการจอง",
        "ราคารวมภาษีและค่าธรรมเนียมแล้ว",
        "โปรดแสดงใบยืนยันนี้เมื่อเช็คอิน",
      ],
    };
  },

  // Generate HTML for PDF
  generateHTML: (pdfData) => {
    return `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pdfData.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Sarabun', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333;
            padding: 20px;
          }
          .container { max-width: 800px; margin: 0 auto; }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #e74c3c; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 { color: #e74c3c; font-size: 24px; margin-bottom: 10px; }
          .booking-id { 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 5px; 
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
          }
          .section { margin-bottom: 25px; }
          .section h2 { 
            color: #2c3e50; 
            border-bottom: 1px solid #bdc3c7; 
            padding-bottom: 5px; 
            margin-bottom: 15px;
          }
          .place-info { 
            display: flex; 
            gap: 20px; 
            margin-bottom: 20px;
            align-items: center;
          }
          .place-image { 
            width: 150px; 
            height: 100px; 
            object-fit: cover; 
            border-radius: 8px;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 15px; 
            margin-bottom: 20px;
          }
          .info-item { 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 5px;
            border-left: 4px solid #e74c3c;
          }
          .info-item strong { color: #2c3e50; }
          .price-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
          }
          .price-table th, .price-table td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #ddd;
          }
          .price-table th { 
            background: #f8f9fa; 
            color: #2c3e50;
          }
          .total-row { 
            font-weight: bold; 
            background: #e8f5e8;
            color: #27ae60;
          }
          .terms { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            border-radius: 5px; 
            padding: 15px;
          }
          .terms ul { margin-left: 20px; }
          .terms li { margin-bottom: 8px; }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #bdc3c7;
            color: #7f8c8d;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 ใบยืนยันการจองที่พัก</h1>
            <p>ระบบจองที่พักออนไลน์</p>
          </div>

          <div class="booking-id">
            รหัสการจอง: ${pdfData.bookingId}<br>
            วันที่ออกใบยืนยัน: ${pdfData.timestamp}
          </div>

          <div class="section">
            <h2>📍 ข้อมูลที่พัก</h2>
            <div class="place-info">
              <div>
                <h3>${pdfData.place.name}</h3>
                <p><strong>ประเภท:</strong> ${pdfData.place.category}</p>
                <p><strong>ตำแหน่ง:</strong> ${pdfData.place.location}</p>
                <div style="display: flex; align-items: center; margin-top: 5px;">
                  <span>⭐ 4.8 (124 รีวิว)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📅 รายละเอียดการจอง</h2>
            <div class="info-grid">
              <div class="info-item">
                <strong>📅 วันเช็คอิน</strong><br>
                ${pdfData.booking.checkIn}
              </div>
              <div class="info-item">
                <strong>📅 วันเช็คเอาท์</strong><br>
                ${pdfData.booking.checkOut}
              </div>
              <div class="info-item">
                <strong>👥 จำนวนผู้เข้าพัก</strong><br>
                ${pdfData.booking.guests} คน
              </div>
              <div class="info-item">
                <strong>🌙 จำนวนคืน</strong><br>
                ${pdfData.booking.nights} คืน
              </div>
            </div>
          </div>

          <div class="section">
            <h2>💰 สรุปค่าใช้จ่าย</h2>
            <table class="price-table">
              <tr>
                <th>รายการ</th>
                <th style="text-align: right;">จำนวนเงิน</th>
              </tr>
              <tr>
                <td>ค่าที่พัก (฿${pdfData.pricing.basePrice?.toLocaleString()} × ${
      pdfData.booking.nights
    } คืน)</td>
                <td style="text-align: right;">฿${pdfData.pricing.totalPerNight?.toLocaleString()}</td>
              </tr>
              <tr>
                <td>ค่าธรรมเนียมการบริการ</td>
                <td style="text-align: right;">฿${pdfData.pricing.serviceFee?.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td><strong>ยอดรวมทั้งสิ้น</strong></td>
                <td style="text-align: right;"><strong>฿${pdfData.pricing.totalPrice?.toLocaleString()}</strong></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>📋 เงื่อนไขและข้อตกลง</h2>
            <div class="terms">
              <ul>
                ${pdfData.terms.map((term) => `<li>${term}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>ขอบคุณที่เลือกใช้บริการของเรา</p>
            <p>หากมีข้อสงสัยกรุณาติดต่อ: support@booking.com | Tel: 02-xxx-xxxx</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  // Download PDF function
  downloadPDF: async (bookingData) => {
    const pdfData = BookingPDF.generatePDFData(bookingData);
    const htmlContent = BookingPDF.generateHTML(pdfData);

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      // Close window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  },

  // Preview component for showing PDF content
  Preview: ({ bookingData }) => {
    if (!bookingData) return null;

    const pdfData = BookingPDF.generatePDFData(bookingData);
    const { place, selectedDate, nights, basePrice, serviceFee, totalPrice } =
      bookingData;

    return (
      <div className="bg-white p-6 rounded-lg border max-w-2xl mx-auto">
        <div className="text-center border-b-2 border-red-500 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-red-600 mb-2 flex items-center justify-center">
            <Home className="w-6 h-6 mr-2" />
            ใบยืนยันการจองที่พัก
          </h1>
          <p className="text-gray-600">ระบบจองที่พักออนไลน์</p>
        </div>

        <div className="bg-gray-50 p-3 rounded text-center font-bold mb-6">
          รหัสการจอง: {pdfData.bookingId}
          <br />
          วันที่ออกใบยืนยัน: {pdfData.timestamp}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            ข้อมูลที่พัก
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={place.secure_url}
              alt={place.title}
              className="w-24 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{place.title}</h3>
              <p className="text-sm text-gray-600">ประเภท: {place.category}</p>
              <div className="flex items-center text-yellow-500 text-sm">
                <Star className="w-4 h-4 mr-1 fill-current" />
                4.8 (124 รีวิว)
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            รายละเอียดการจอง
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded">
              <strong>วันเช็คอิน:</strong>
              <br />
              {new Date(selectedDate.checkIn).toLocaleDateString("th-TH")}
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>วันเช็คเอาท์:</strong>
              <br />
              {new Date(selectedDate.checkOut).toLocaleDateString("th-TH")}
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>จำนวนผู้เข้าพัก:</strong>
              <br />
              {selectedDate.guests} คน
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <strong>จำนวนคืน:</strong>
              <br />
              {nights} คืน
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            สรุปค่าใช้จ่าย
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>
                ค่าที่พัก (฿{basePrice?.toLocaleString()} × {nights} คืน)
              </span>
              <span>฿{(basePrice * nights)?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>ค่าธรรมเนียมการบริการ</span>
              <span>฿{serviceFee?.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-green-600">
              <span>ยอดรวมทั้งสิ้น</span>
              <span>฿{totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            เงื่อนไขและข้อตกลง
          </h3>
          <ul className="text-sm space-y-1 ml-4">
            {pdfData.terms.map((term, index) => (
              <li key={index}>• {term}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
};

export default BookingPDF;
