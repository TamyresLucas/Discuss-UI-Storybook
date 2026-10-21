import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('shows the label and the value', () => {
    render(<StatCard label="Completion time" value="5 minutes" />);
    expect(screen.getByText('Completion time')).toBeInTheDocument();
    expect(screen.getByText('5 minutes')).toBeInTheDocument();
  });

  it('shows a caption under the value, after it in the card', () => {
    const { container } = render(<StatCard label="Questions" value="16" caption="11 open-ended · 5 closed-ended" />);
    const caption = screen.getByText('11 open-ended · 5 closed-ended');
    expect(caption).toHaveClass('text-secondary-muted-foreground');
    const paragraphs = [...container.querySelectorAll('p')].map((p) => p.textContent);
    expect(paragraphs).toEqual(['Questions', '16', '11 open-ended · 5 closed-ended']);
  });

  it('adds nothing when there is no caption, so existing cards are unchanged', () => {
    const { container } = render(<StatCard label="Questions" value="16" />);
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });

  it('has no accessibility violations with a caption', async () => {
    const { container } = render(<StatCard label="Questions" value="16" caption="11 open-ended · 5 closed-ended" variant="subtle" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
