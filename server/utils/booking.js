const calNight = (checkIn, checkOut) => {
  const milliDay = checkOut.getTime() - checkIn.getTime();
  // 86,400,000 = 1 วัน  / (1000 * 60 * 60 * 24) = 1 วัน
  const diffDay = milliDay / (1000 * 60 * 60 * 24);
  return diffDay;
};

exports.calTotal = (price, checkIn, checkOut) => {
  if (!checkIn || !checkOut) return;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  //ส่ง argument function calMight ไปคำนวณ
  const totalNight = calNight(checkInDate, checkOutDate);
  const total = totalNight * price;

  return { totalNight, total };
};