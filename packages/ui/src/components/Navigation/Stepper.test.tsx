import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Step, StepPath, Stepper } from './Stepper';

const STEPS = [{ label: 'Import a file' }, { label: 'Study details' }, { label: 'Research method' }];

describe('Stepper', () => {
  it('marks the steps before the current one completed and the current one with aria-current', () => {
    render(<Stepper aria-label="Progress" steps={STEPS} current={1} />);
    const items = screen.getAllByRole('listitem').filter((li) => li.getAttribute('aria-hidden') !== 'true');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Import a file, completed');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent(/^Study details$/);
    expect(items[2]).not.toHaveAttribute('aria-current');
  });

  it('turns a path green only between two completed steps', () => {
    const { container } = render(<Stepper aria-label="Progress" steps={STEPS} current={2} />);
    const lines = container.querySelectorAll('li[aria-hidden="true"] > div > div');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveClass('bg-success-foreground');
    expect(lines[1]).toHaveClass('bg-border');
  });

  it('reads an error step as such', () => {
    render(<Stepper aria-label="Progress" steps={[{ label: 'Upload', error: true }, { label: 'Review' }]} current={1} />);
    expect(screen.getByText('Upload')).toHaveTextContent('Upload, error');
  });

  it('puts the label before the indicator in the vertical layout', () => {
    const { container } = render(<Step label="Step" orientation="vertical" selected />);
    const step = container.firstElementChild!;
    expect(step.firstElementChild?.tagName).toBe('SPAN');
    expect(step.lastElementChild?.tagName.toLowerCase()).toBe('svg');
  });

  it('renders the path as decoration', () => {
    const { container } = render(<StepPath completed />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Stepper aria-label="Progress" steps={STEPS} current={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
