const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "day", seconds: 86_400 },
  { unit: "hour", seconds: 3_600 },
  { unit: "minute", seconds: 60 },
];

export const formatRelativeTime = (date: Date, now: number, locale: string) => {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const elapsedSeconds = Math.max(0, Math.round((now - date.getTime()) / 1000));
  const match = units.find(({ seconds }) => elapsedSeconds >= seconds);

  if (!match) return formatter.format(0, "second");
  return formatter.format(-Math.floor(elapsedSeconds / match.seconds), match.unit);
};
