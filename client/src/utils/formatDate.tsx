// formatDate formats the date to show how much time ago something was done i.e 3 hours ago, 30 days ago, 5 years ago

const MS_IN_DAY = 1000 * 60 * 60 * 24;
const MS_IN_HOUR = 1000 * 60 * 60;
const MS_IN_MINUTE = 1000 * 60;
const MS_IN_SECOND = 1000;

export const formatDate = (dateString: string): string => {
  const currentDate: Date = new Date();
  const otherDate: Date = new Date(dateString);

  const utc1 = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const utc2 = Date.UTC(
    otherDate.getFullYear(),
    otherDate.getMonth(),
    otherDate.getDate()
  );

  // TODO: Rework since this looks kinda bad
  const dayDiff = Math.floor((utc2 - utc1) / MS_IN_DAY);
  if (dayDiff === 0) {
    const hourDiff = Math.floor((utc2 - utc1) / MS_IN_HOUR);
    if (hourDiff === 0) {
      const minuteDiff = Math.floor((utc2 - utc1) / MS_IN_MINUTE);
      if (minuteDiff === 0) {
        const secondDiff = Math.floor((utc2 - utc1) / MS_IN_SECOND);
        return `${secondDiff} seconds ago`;
      }
      return `${minuteDiff} minutes ago`;
    }
    return `${hourDiff} hours ago`;
  }
  return `${dayDiff} days ago`;
};
