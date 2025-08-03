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
import { FileText, RotateCw } from "lucide-react";

// Register Thai font
Font.register({
  family: "NotoSansThai",
  src: "/Fonts/NotoSansThai.ttf",
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "NotoSansThai",
    fontSize: 12,
    backgroundColor: "#ffffff",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "2 solid #e74c3c",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
  },
  bookingInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: "center",
  },
  bookingId: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1 solid #bdc3c7",
  },
  placeInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  placeDetails: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 3,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoCard: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 5,
    borderLeft: "4 solid #e74c3c",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 12,
    color: "#333333",
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 8,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: "right",
  },
  tableCellBold: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 8,
    fontWeight: "bold",
  },
  totalRow: {
    backgroundColor: "#e8f5e8",
    paddingVertical: 10,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27ae60",
  },
  terms: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 5,
    border: "1 solid #ffeaa7",
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  termsList: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  footer: {
    textAlign: "center",
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1 solid #bdc3c7",
    color: "#7f8c8d",
    fontSize: 10,
  },
});

// PDF Document Component
const BookingInvoice = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏠 ใบยืนยันการจองที่พัก</Text>
        <Text style={styles.subtitle}>ระบบจองที่พักออนไลน์</Text>
      </View>

      {/* Booking Info */}
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingId}>รหัสการจอง: #{booking.id}</Text>
        <Text>วันที่ออกใบยืนยัน: {formatDate(new Date(), "th")}</Text>
      </View>

      {/* Place Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 ข้อมูลที่พัก</Text>
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{booking.Place?.title}</Text>
          <Text style={styles.placeDetails}>ประเภท: ที่พักและรีสอร์ท</Text>
          <Text style={styles.placeDetails}>คะแนน: ⭐ 4.8 (124 รีวิว)</Text>
        </View>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 รายละเอียดการจอง</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📅 วันเช็คอิน</Text>
            <Text style={styles.infoValue}>
              {formatDate(booking.checkIn, "th")}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📅 วันเช็คเอาท์</Text>
            <Text style={styles.infoValue}>
              {formatDate(booking.checkOut, "th")}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>🌙 จำนวนคืน</Text>
            <Text style={styles.infoValue}>
              {Math.ceil(
                (new Date(booking.checkOut) - new Date(booking.checkIn)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              คืน
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>🏠 ห้องที่จอง</Text>
            <Text style={styles.infoValue}>
              {booking.Room?.name || "ห้องมาตรฐาน"}
            </Text>
          </View>
        </View>
      </View>

      {/* Pricing Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 สรุปค่าใช้จ่าย</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellBold}>รายการ</Text>
            <Text style={[styles.tableCellBold, { textAlign: "right" }]}>
              จำนวนเงิน
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              ค่าที่พัก (
              {Math.ceil(
                (new Date(booking.checkOut) - new Date(booking.checkIn)) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              คืน)
            </Text>
            <Text style={styles.tableCellRight}>
              ฿{booking.totalPrice?.toLocaleString()}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>ค่าธรรมเนียมการบริการ</Text>
            <Text style={styles.tableCellRight}>฿0</Text>
          </View>
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={[styles.tableCellBold, styles.totalAmount]}>
              ยอดรวมทั้งสิ้น
            </Text>
            <Text
              style={[
                styles.tableCellBold,
                styles.totalAmount,
                { textAlign: "right" },
              ]}
            >
              ฿{booking.totalPrice?.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 เงื่อนไขและข้อตกลง</Text>
        <View style={styles.terms}>
          <Text style={styles.termsTitle}>เงื่อนไขการใช้บริการ:</Text>
          <Text style={styles.termsList}>
            • การยกเลิกฟรีภายใน 24 ชั่วโมง{"\n"}• ชำระเงินหลังจากยืนยันการจอง
            {"\n"}• ราคารวมภาษีและค่าธรรมเนียมแล้ว{"\n"}•
            โปรดแสดงใบยืนยันนี้เมื่อเช็คอิน{"\n"}• ห้ามสูบบุหรี่ในห้องพัก{"\n"}•
            เช็คอินหลัง 14:00 น. / เช็คเอาท์ก่อน 12:00 น.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>ขอบคุณที่เลือกใช้บริการของเรา</Text>
        <Text>
          หากมีข้อสงสัยกรุณาติดต่อ: support@booking.com | Tel: 02-xxx-xxxx
        </Text>
      </View>
    </Page>
  </Document>
);

// Main PDF Component
const BookingPDF = ({ booking }) => {
  if (!booking) return null;

  return (
    <div>
      <PDFDownloadLink
        document={<BookingInvoice booking={booking} />}
        fileName={`booking-invoice-${booking.id}.pdf`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        {({ loading }) =>
          loading ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              กำลังสร้าง PDF...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              ดาวน์โหลด PDF
            </>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default BookingPDF;
