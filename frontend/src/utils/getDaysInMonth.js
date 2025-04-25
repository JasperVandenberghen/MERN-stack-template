export const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString('en-GB', {
    month: 'short',
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
};
