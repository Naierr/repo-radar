export interface IRelativeTimeProps {
  /** An ISO string or a Date. */
  date: string | Date;
  /** Shown when the date is missing or invalid. */
  fallback?: string;
}
