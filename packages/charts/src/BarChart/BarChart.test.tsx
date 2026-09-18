import { renderWithTheme } from '@repo-radar/ui/testing';
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BarChart from '.';
import type { IBarDatum } from './types';

const DATA: IBarDatum[] = [
  { id: '1', label: 'facebook/react', value: 234_567 },
  { id: '2', label: 'reduxjs/redux-toolkit', value: 11_020 },
];

describe('BarChart', () => {
  it('exposes every bar as a row in an accessible data table', () => {
    renderWithTheme(
      <BarChart data={DATA} title="Stars per repository" valueLabel="Stars" />,
    );

    const table = screen.getByRole('table', { name: 'Stars per repository' });
    const rows = within(table).getAllByRole('row');

    expect(rows).toHaveLength(DATA.length + 1);
    expect(
      within(table).getByRole('rowheader', { name: 'facebook/react' }),
    ).toBeInTheDocument();
    expect(within(table).getByText('234,567')).toBeInTheDocument();
  });

  it('formats values with the formatter it is given', () => {
    renderWithTheme(
      <BarChart
        data={DATA}
        title="Stars per repository"
        valueLabel="Stars"
        valueFormatter={(value) => `${value} ★`}
      />,
    );

    expect(screen.getByText('11020 ★')).toBeInTheDocument();
  });

  it('renders an empty table without data', () => {
    renderWithTheme(
      <BarChart data={[]} title="Stars per repository" valueLabel="Stars" />,
    );

    const table = screen.getByRole('table', { name: 'Stars per repository' });
    expect(within(table).getAllByRole('row')).toHaveLength(1);
  });
});
