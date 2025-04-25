const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate)) {
    throw new Error('Invalid date format');
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export default calculateAge;
