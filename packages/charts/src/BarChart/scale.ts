/**
 * Three stars beside 266,000 rounds to no bar at all, and an empty row reads
 * as "none" rather than "very few". Anything above zero is drawn at least this
 * share of the largest so its presence is visible.
 *
 * At that end of the scale the bar becomes a presence indicator rather than a
 * measurement, which is the trade: every label, tooltip and table cell is
 * formatted from the datum instead, so the true figure is never the thing that
 * got rounded away.
 */
export const MIN_VISIBLE_SHARE = 0.012;

/** Zero stays zero — nothing is not a small something. */
export const withVisibleFloor = (
  values: number[],
  share = MIN_VISIBLE_SHARE,
): number[] => {
  const largest = values.reduce((max, value) => Math.max(max, value), 0);
  const floor = largest * share;
  return values.map((value) => (value > 0 ? Math.max(value, floor) : value));
};
