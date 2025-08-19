
// Helper function สำหรับสร้าง Date โดยไม่มี timezone offset
const createLocalDate = (dateString) => {
  if (dateString.includes('T')) {
    // ถ้าเป็น ISO string แล้ว ให้สร้าง Date ตรงๆ
    return new Date(dateString);
  }
  
  // ถ้าเป็น date string format YYYY-MM-DD หรือ MM/DD/YYYY
  const date = new Date(dateString + 'T00:00:00.000Z');
  // หรือใช้วิธีนี้เพื่อให้แน่ใจว่าได้ local date
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  
  return new Date(dateString);
};

module.exports = {
  createLocalDate,
};