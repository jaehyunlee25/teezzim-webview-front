export const isLeapYear = year => {
  // 4의 배수인 해
  // 예외조건 : 100의 배수이지만 400의 배수는 아닌 해는 평년
  if (year % 4 === 0) {
    if (year % 100 === 0) return year % 400 === 0;
    return true;
  }
  return false;
};

export const getTotalDate = (year, month) => {
  // 1, 3, 5, 7, 8, 10, 12 => 31일
  // 2 => 28일(평년)-29일(윤년)
  // 4, 6, 9, 11 => 30일
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  else if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  else return 31;
};

export const getOffsetFirstDay = datetime => {
  return new Date(datetime).getUTCDay();
};
