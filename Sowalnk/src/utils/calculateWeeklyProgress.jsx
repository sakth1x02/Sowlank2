export const calculateWeeklyProgress = (task) => {
  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  const now = new Date();

  end.setHours(23, 59, 59, 999);

  if (now <= start) {
    return 0;
  }
  if (now >= end) {
    return 100;
  }

  const progress = Math.round(((now - start) / (end - start)) * 100);
  return progress;
};
