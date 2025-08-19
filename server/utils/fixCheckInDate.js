
// Helper function สำหรับสร้าง Date โดยไม่มี timezone offset
// Helper function สำหรับแปลง checkIn +1 วัน
const fixCheckInDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date;
};

module.exports = {
  fixCheckInDate,
};