const areSameDay = (date1, date2) =>
  date1.toDateString() === date2.toDateString();

export const formatDate = (utcDate) => {
  const date = new Date(utcDate);
  const today = new Date();

  if (areSameDay(date, today)) {
    return 'Today';
  }

  return date.toLocaleDateString('nl-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (utcDate) => {
  const dateObj = new Date(utcDate);
  return dateObj.toLocaleTimeString('nl-BE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatQueryDate = (utcDate) => {
  const date = new Date(utcDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};
