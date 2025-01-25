export const calculateProgress = (start, end) => {
  const currentTime = new Date();
  const startTime = new Date(currentTime.toDateString() + " " + start);
  const endTime = new Date(currentTime.toDateString() + " " + end);

  if (currentTime < startTime) return 0;
  if (currentTime > endTime) return 100;

  const totalDuration = endTime - startTime;
  const timePassed = currentTime - startTime;

  return Math.round((timePassed / totalDuration) * 100);
};
