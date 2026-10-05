import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes its value to assistive tech', () => {
    render(<Progress value={64} aria-label="Project progress" />);
    expect(screen.getByRole('progressbar', { name: 'Project progress' })).toHaveAttribute('aria-valuenow', '64');
  });

  it('renders the header and detail captions', () => {
    render(
      <Progress
        value={64}
        label="Project Progress"
        valueLabel
        detailsStart="16 of 25 tasks completed"
        detailsEnd="Est. 3 days remaining"
      />,
    );
    expect(screen.getByText('Project Progress')).toBeInTheDocument();
    expect(screen.getByText('64%')).toBeInTheDocument();
    expect(screen.getByText('16 of 25 tasks completed')).toBeInTheDocument();
    expect(screen.getByText('Est. 3 days remaining')).toBeInTheDocument();
  });

  it('clamps the value to 0–100', () => {
    render(<Progress value={150} aria-label="Over" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Progress value={40} aria-label="Upload" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
