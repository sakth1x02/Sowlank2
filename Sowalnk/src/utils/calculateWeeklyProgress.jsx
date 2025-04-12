export const calculateWeeklyProgress = (task) => {
  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  const now = new Date();
  end.setHours(23, 59, 59, 999);
  if (now <= start) return 0;

  // Check if current time is greater than or equal to end time
  if (now >= end) return 100;

  return Math.round(((now - start) / (end - start)) * 100);
};
