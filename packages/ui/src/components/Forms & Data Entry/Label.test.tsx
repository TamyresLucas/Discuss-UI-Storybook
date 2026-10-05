import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Label } from './Label';

describe('Label', () => {
  it('associates with a field via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Label htmlFor="email">Email</Label>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
