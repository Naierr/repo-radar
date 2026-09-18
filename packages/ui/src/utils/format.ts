const LOCALE = 'en-US';

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 4.34524;
const MONTHS_PER_YEAR = 12;
const MS_PER_SECOND = 1000;

// Each step says how many of the current unit fit in the next one.
const RELATIVE_TIME_STEPS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: SECONDS_PER_MINUTE, unit: 'second' },
  { amount: MINUTES_PER_HOUR, unit: 'minute' },
  { amount: HOURS_PER_DAY, unit: 'hour' },
  { amount: DAYS_PER_WEEK, unit: 'day' },
  { amount: WEEKS_PER_MONTH, unit: 'week' },
  { amount: MONTHS_PER_YEAR, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

const compactNumberFormat = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const numberFormat = new Intl.NumberFormat(LOCALE);
const relativeTimeFormat = new Intl.RelativeTimeFormat(LOCALE, {
  numeric: 'auto',
});
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** `Math.round` sends -1.5 to -1 but 1.5 to 2; past and future must agree. */
const roundAwayFromZero = (value: number): number =>
  Math.sign(value) * Math.round(Math.abs(value));

/** 12345 → "12.3k", the way GitHub prints counts. */
export const formatCompactNumber = (value: number): string =>
  compactNumberFormat.format(value).toLowerCase();

/** 12345 → "12,345". */
export const formatNumber = (value: number): string =>
  numberFormat.format(value);

/**
 * "3 days ago", "in 2 hours", "now" — relative to `now`. Anything within a
 * minute either way is "now": callers refresh `now` once a minute, so a
 * just-written timestamp can briefly sit ahead of it.
 */
export const formatRelativeTime = (date: Date, now: Date): string => {
  let delta = (date.getTime() - now.getTime()) / MS_PER_SECOND;

  if (Math.abs(delta) < SECONDS_PER_MINUTE) {
    return relativeTimeFormat.format(0, 'second');
  }

  for (const { amount, unit } of RELATIVE_TIME_STEPS) {
    if (Math.abs(delta) < amount) {
      return relativeTimeFormat.format(roundAwayFromZero(delta), unit);
    }
    delta /= amount;
  }

  return relativeTimeFormat.format(roundAwayFromZero(delta), 'year');
};

/** "Sep 18, 2026, 2:21 PM". */
export const formatDateTime = (date: Date): string =>
  dateTimeFormat.format(date);
