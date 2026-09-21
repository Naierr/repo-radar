import { renderWithTheme } from '@repo-radar/ui/testing';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Sparkline from '.';

const LABEL = 'Stars since tracking began';

describe('Sparkline', () => {
  it('names the shape for anyone who cannot see it', () => {
    renderWithTheme(<Sparkline values={[1, 5, 3, 9]} label={LABEL} />);

    expect(screen.getByRole('img', { name: LABEL })).toBeInTheDocument();
  });

  it('draws nothing from a single reading', () => {
    const { container } = renderWithTheme(
      <Sparkline values={[7]} label={LABEL} />,
    );

    // One point is a dot, not a trend — better to say nothing.
    expect(container).toBeEmptyDOMElement();
  });

  it('still draws a line when every reading is identical', () => {
    // A flat run has a zero range; dividing by it would put the path at NaN.
    const { container } = renderWithTheme(
      <Sparkline values={[4, 4, 4]} label={LABEL} />,
    );

    const path = container.querySelector('path')?.getAttribute('d') ?? '';
    expect(path).not.toContain('NaN');
    expect(path).toContain('M0.0 8.0');
  });
});
