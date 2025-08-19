import { formatDate } from "@/utils/formatDate";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Font } from "@react-pdf/renderer";
import { Download, FileText, RotateCw } from "lucide-react";

// Register Thai font

Font.register({
  family: "NotoSansThai",
  src: "https://fonts.gstatic.com/s/notosansthai/v20/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf",
});

// Utility function for date formatting

// Enhanced PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: "NotoSansThai",
    fontSize: 11,
    backgroundColor: "#ffffff",
  },
  // Header styles
  headerContainer: {
    marginBottom: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: "2 solid #1e40af",
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 3,
  },
  companyDetails: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 1.4,
  },
  receiptBadge: {
    backgroundColor: "#1e40af",
    padding: 10,
    borderRadius: 5,
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  receiptNumber: {
    fontSize: 10,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 3,
  },
  // Customer info section
  customerSection: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    border: "1 solid #e2e8f0",
  },
  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  customerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  customerItem: {
    width: "48%",
  },
  label: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: "#1e293b",
    fontWeight: "500",
  },
  // Booking details
  bookingSection: {
    marginBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#fef3c7",
    padding: 15,
    borderRadius: 8,
    borderLeft: "4 solid #f59e0b",
  },
  bookingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bookingItem: {
    width: "31%",
  },
  // Table styles
  tableSection: {
    marginBottom: 20,
  },
  table: {
    border: "1 solid #e2e8f0",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottom: "1 solid #e2e8f0",
  },
  tableRowAlternate: {
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 10,
    color: "#475569",
  },
  tableCellBold: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  // Summary section
  summarySection: {
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: "#f0fdf4",
    padding: 15,
    borderRadius: 8,
    border: "1 solid #86efac",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#475569",
  },
  summaryValue: {
    fontSize: 11,
    color: "#1e293b",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTop: "2 solid #22c55e",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#166534",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#166534",
  },
  // Payment info
  paymentSection: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  paymentCard: {
    flex: 1,
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    border: "1 solid #bfdbfe",
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  paymentDetails: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.4,
  },
  // Terms section
  termsSection: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    border: "1 solid #fecaca",
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#991b1b",
    marginBottom: 5,
  },
  termsList: {
    fontSize: 9,
    color: "#7f1d1d",
    lineHeight: 1.5,
  },
  // Signature section
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingTop: 20,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1 solid #94a3b8",
    marginBottom: 5,
    height: 40,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  signatureDate: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 3,
    textAlign: "center",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 35,
    right: 35,
    paddingTop: 15,
    borderTop: "1 solid #e2e8f0",
  },
  footerText: {
    fontSize: 9,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 1.4,
  },
  // QR Code placeholder
  qrSection: {
    position: "absolute",
    top: 35,
    right: 35,
    width: 80,
    height: 80,
    backgroundColor: "#f8fafc",
    border: "1 solid #e2e8f0",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
  },
});

// Enhanced PDF Document Component
const BookingReceipt = ({ booking }) => {
  const nights = Math.ceil(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) /
      (1000 * 60 * 60 * 24)
  );
  
  const pricePerNight = booking.totalPrice / nights;
  const serviceFee = 0;
  const vat = booking.totalPrice * 0.07;
  const subtotal = booking.totalPrice - vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrText}>QR Code{"\n"}สำหรับตรวจสอบ</Text>
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>BOOKYLIFE HOTELS</Text>
              <Text style={styles.companyDetails}>
                9/25 จังหวัดนครสวรรค์ อ.เมือง 60000
              </Text>
            </View>
            <View style={styles.receiptBadge}>
              <Text style={styles.receiptTitle}>ใบเสร็จรับเงิน</Text>
              <Text style={styles.receiptNumber}>#{booking.id}</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>ข้อมูลผู้จอง</Text>
          <View style={styles.customerGrid}>
            <View style={styles.customerItem}>
              <Text style={styles.label}>ชื่อ-นามสกุล</Text>
              <Text style={styles.value}>{booking.User?.name || "ลูกค้าทั่วไป"}</Text>
            </View>
            <View style={styles.customerItem}>
              <Text style={styles.label}>อีเมล</Text>
              <Text style={styles.value}>{booking.User?.email || "-"}</Text>
            </View>
            <View style={styles.customerItem}>
              <Text style={styles.label}>เบอร์โทรศัพท์</Text>
              <Text style={styles.value}>{booking.User?.phone || "-"}</Text>
            </View>
            <View style={styles.customerItem}>
              <Text style={styles.label}>วันที่ออกใบเสร็จ</Text>
              <Text style={styles.value}>{formatDate(new Date(), "th")}</Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>รายละเอียดการจอง</Text>
          <View style={styles.bookingCard}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: "#92400e" }}>
                {booking.Place?.title}
              </Text>
              <Text style={{ fontSize: 10, color: "#78350f" }}>
                {booking.Place?.category} | {booking.Room?.name || "ห้องมาตรฐาน"}
              </Text>
            </View>
            <View style={styles.bookingGrid}>
              <View style={styles.bookingItem}>
                <Text style={styles.label}>เช็คอิน</Text>
                <Text style={styles.value}>{formatDate(booking.checkIn, "th")}</Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.label}>เช็คเอาท์</Text>
                <Text style={styles.value}>{formatDate(booking.checkOut, "th")}</Text>
              </View>
              <View style={styles.bookingItem}>
                <Text style={styles.label}>จำนวนคืน</Text>
                <Text style={styles.value}>{nights} คืน</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pricing Table */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>รายการค่าใช้จ่าย</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>รายการ</Text>
              <Text style={[styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>
                จำนวน
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: "right" }]}>
                ราคาต่อหน่วย
              </Text>
              <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: "right" }]}>
                จำนวนเงิน
              </Text>
            </View>
            <View style={[styles.tableRow, styles.tableRowAlternate]}>
              <Text style={[styles.tableCell, { flex: 3 }]}>
                ค่าที่พัก - {booking.Room?.name || "ห้องมาตรฐาน"}
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                {nights}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>
                ฿{pricePerNight.toLocaleString()}
              </Text>
              <Text style={[styles.tableCellBold, { flex: 1.5, textAlign: "right" }]}>
                ฿{subtotal.toFixed(2).toLocaleString()}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 3 }]}>ค่าธรรมเนียมการบริการ</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>1</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>฿0</Text>
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: "right" }]}>฿0</Text>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ราคารวมก่อนภาษี</Text>
              <Text style={styles.summaryValue}>฿{subtotal.toFixed(2).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ภาษีมูลค่าเพิ่ม (7%)</Text>
              <Text style={styles.summaryValue}>฿{vat.toFixed(2).toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>ยอดชำระทั้งสิ้น</Text>
              <Text style={styles.totalValue}>
                ฿{booking.totalPrice?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>วิธีการชำระเงิน</Text>
            <Text style={styles.paymentDetails}>
              บัตรเครดิต/เดบิต{"\n"}
              วันที่ชำระ: {formatDate(new Date(), "th")}{"\n"}
              สถานะ: ชำระเงินแล้ว
            </Text>
          </View>
          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>หมายเหตุ</Text>
            <Text style={styles.paymentDetails}>
              การจองนี้ได้รับการยืนยันแล้ว{"\n"}
              กรุณาแสดงใบเสร็จนี้เมื่อเช็คอิน
            </Text>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>เงื่อนไขและข้อตกลง</Text>
          <Text style={styles.termsList}>
            • ใบเสร็จนี้ออกให้สำหรับการจองที่พักที่ได้รับการยืนยันและชำระเงินเรียบร้อยแล้ว{"\n"}
            • การยกเลิกการจองให้เป็นไปตามนโยบายของโรงแรม{"\n"}
            • ราคาที่แสดงรวมภาษีมูลค่าเพิ่มแล้ว{"\n"}
            • หากมีข้อสงสัยกรุณาติดต่อฝ่ายบริการลูกค้า
          </Text>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>ผู้รับเงิน</Text>
            <Text style={styles.signatureDate}>วันที่ {formatDate(new Date(), "th")}</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>ผู้อนุมัติ</Text>
            <Text style={styles.signatureDate}>วันที่ {formatDate(new Date(), "th")}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ขอบคุณที่เลือกใช้บริการ BOOKYLIFE HOTELS{"\n"}
            support@bookylife.com | โทร: 02-XXX-XXXX | www.bookylife.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component with Download Button
const BookingPDF = ({ booking }) => {
  // Sample booking data for demonstration
  const sampleBooking = booking || {
    id: "BK2024112301",
    checkIn: new Date("2024-12-01"),
    checkOut: new Date("2024-12-03"),
    totalPrice: 4500,
    Place: {
      title: "โรงแรมริเวอร์ไซด์ กรุงเทพ",
      category: "โรงแรม 5 ดาว"
    },
    Room: {
      name: "ห้องดีลักซ์ วิวแม่น้ำ"
    },
    User: {
      name: "คุณสมชาย ใจดี",
      email: "somchai@example.com",
      phone: "089-123-4567"
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ใบเสร็จรับเงิน</h1>
          <p className="text-gray-600">รหัสการจอง: #{sampleBooking.id}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">ชื่อผู้จอง</span>
            <span className="font-semibold text-gray-800">{sampleBooking.User?.name}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">ที่พัก</span>
            <span className="font-semibold text-gray-800 text-right max-w-[200px]">
              {sampleBooking.Place?.title}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">จำนวนเงิน</span>
            <span className="font-bold text-2xl text-green-600">
              ฿{sampleBooking.totalPrice?.toLocaleString()}
            </span>
          </div>
        </div>

        <PDFDownloadLink
          document={<BookingReceipt booking={sampleBooking} />}
          fileName={`receipt-${sampleBooking.id}.pdf`}
          className="w-full"
        >
          {({ blob, url, loading, error }) => (
            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>กำลังสร้างใบเสร็จ...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>ดาวน์โหลดใบเสร็จ PDF</span>
                </>
              )}
            </button>
          )}
        </PDFDownloadLink>

        <p className="text-center text-sm text-gray-500 mt-6">
          ใบเสร็จนี้ออกโดยระบบอัตโนมัติ
        </p>
      </div>
    </div>
  );
};

export default BookingPDF;
