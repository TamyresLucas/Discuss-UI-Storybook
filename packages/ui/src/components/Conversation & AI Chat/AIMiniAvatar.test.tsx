import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { AIMiniAvatar } from './AIMiniAvatar';

describe('AIMiniAvatar', () => {
  it('shows only the mark when idle', () => {
    render(<AIMiniAvatar />);
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it.each([
    ['thinking', 'Thinking...'],
    ['executing', 'Executing...'],
    ['working', 'Working on it...'],
  ] as const)('announces the %s status', (status, text) => {
    render(<AIMiniAvatar status={status} />);
    expect(screen.getByRole('status')).toHaveTextContent(text);
  });

  it('shows the elapsed time only while working', () => {
    const { rerender } = render(<AIMiniAvatar status="working" elapsed="45 s" />);
    expect(screen.getByText('45 s')).toBeInTheDocument();
    rerender(<AIMiniAvatar status="thinking" elapsed="45 s" />);
    expect(screen.queryByText('45 s')).not.toBeInTheDocument();
  });

  it('draws the mark on while busy, and keeps it still when idle or when motion is reduced', () => {
    const { container, rerender } = render(<AIMiniAvatar status="thinking" />);
    const mark = () => container.querySelector('svg')!;
    // `motion-safe:` keeps the animation out of the way for users who prefer reduced motion.
    expect(mark()).toHaveClass('motion-safe:animate-ai-draw-on');
    expect(mark()).not.toHaveClass('motion-safe:animate-pulse');
    rerender(<AIMiniAvatar status="idle" />);
    expect(mark()).not.toHaveClass('motion-safe:animate-ai-draw-on');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AIMiniAvatar status="working" elapsed="45 s" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
