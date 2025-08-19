
// Helper function สำหรับสร้าง Date โดยไม่มี timezone offset
const createLocalDate = (dateString) => {
  const utcDate = new Date(dateString);
  
  // แปลง UTC เป็น local date โดยเพิ่ม timezone offset
  const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000) + (7 * 60 * 60 * 1000)); // +7 สำหรับไทย
  
  // หรือใช้วิธีง่ายๆ: ใช้แค่ date part
  const dateOnly = new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
  
  console.log('Original UTC:', utcDate);
  console.log('Local date:', dateOnly);
  
  return dateOnly;
};

module.exports = {
  createLocalDate,
};