import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { QuestionHeader } from './QuestionHeader';
import { QuestionNumberTag } from './QuestionNumberTag';

describe('QuestionNumberTag', () => {
  it('reads "Question N" in the neutral look by default, with the grip ready for hover', () => {
    const { container } = render(<QuestionNumberTag number={3} />);
    const tag = screen.getByText('Question 3');
    expect(tag).toHaveClass('bg-secondary', 'text-surface-foreground', 'h-6', 'rounded-sm');
    expect(container.querySelector('svg')).toHaveClass('hidden');
  });

  it('turns accent when active and keeps no grip when it cannot be moved', () => {
    const { container } = render(<QuestionNumberTag number={1} active showDragHandle={false} />);
    expect(screen.getByText('Question 1')).toHaveClass('bg-accent-soft', 'text-accent-soft-foreground');
    expect(container.querySelector('svg')).toBeNull();
  });

  it('is a labelled drag handle when given drag props', () => {
    render(<QuestionNumberTag number={2} dragHandleProps={{ tabIndex: 0 }} />);
    expect(screen.getByLabelText('Reorder question 2')).toHaveClass('cursor-grab');
  });

  it('is the same tag QuestionHeader shows in editor mode', () => {
    render(<QuestionHeader number={4} title="Why?" editor />);
    const inHeader = screen.getByText('Question 4');
    render(<QuestionNumberTag number={5} />);
    expect(screen.getByText('Question 5').className).toBe(inHeader.className.replace(/Question 4/, ''));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<QuestionNumberTag number={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
