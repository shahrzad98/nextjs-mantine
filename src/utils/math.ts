export const getPercentage = (value: number, total: number) => (value * 100) / total;

export const subtractYears = (date: Date, years: number) => {
  date.setFullYear(date.getFullYear() - years);

  return date;
};
