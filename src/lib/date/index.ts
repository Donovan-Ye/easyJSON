const TRIAL_DAYS = 14;

export const getDaysLeft = (startDate?: string) => {
  if (!startDate || isNaN(Date.parse(startDate))) {
    return -1;
  }

  const startDateObj = new Date(startDate);
  const today = new Date();

  const diffTime = Math.abs(today.getTime() - startDateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return TRIAL_DAYS - diffDays;
};
