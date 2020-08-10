export const formatNumber = (num: number): string => {
  if (num > 1000000) return `${(num / 1000000).toPrecision(3)}M`;

  if (num > 1000) return `${(num / 1000).toPrecision(3)}K`;

  // num doesn't need to formatted so just return it
  return String(num);
};
