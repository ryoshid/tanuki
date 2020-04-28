const MS_S = 1000;
const MS_M = MS_S * 60;
const MS_H = MS_M * 60;

export const formatDuration = (ms: number): string => {
  const hour = Math.floor(ms / MS_H);
  const minute = Math.floor((ms - hour * MS_H) / MS_M);
  const second = Math.floor((ms - (hour * MS_H + minute * MS_M)) / MS_S);
  return [hour, minute, second]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};

export const timeDiff = (from: Date, to: Date): string => {
  if (from.getTime() > to.getTime()) return formatDuration(0);
  const diff = to.getTime() - from.getTime();
  return formatDuration(diff);
};
