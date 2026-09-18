# @repo-radar/charts

Themed, accessible charts for Repo Radar, built on MUI X Charts. Charts are
presentational: they take plain data and know nothing about the store or
GitHub.

```tsx
import { BarChart } from '@repo-radar/charts';

<BarChart
  data={[{ id: '1', label: 'reduxjs/redux-toolkit', value: 11221 }]}
  title="Stars per tracked repository"
  valueLabel="Stars"
/>;
```

## BarChart

- Horizontal bars in the order given; the height grows with the data.
- Compact value ticks (`12k`), exact values in tooltips (`11,221`), long labels
  truncated on the axis only.
- Colours come from the design system's series palette, so both colour schemes
  work.
- Screen readers get a visually hidden data table with the same values.
