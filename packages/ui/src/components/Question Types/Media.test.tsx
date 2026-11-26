import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VideoPlayer } from './Media';

const bar = () => screen.getByRole('button', { name: 'Play' }).closest('.bg-surface-foreground');

describe('VideoPlayer controls', () => {
  it('keeps the control bar on screen by default', () => {
    render(<VideoPlayer name="Clip" />);
    expect(bar()).not.toHaveClass('opacity-0');
  });

  it('shows the control bar only on hover or keyboard focus with controls="hover"', () => {
    render(<VideoPlayer name="Clip" controls="hover" />);
    expect(bar()).toHaveClass('opacity-0', 'group-hover/player:opacity-100', 'group-focus-within/player:opacity-100');
    expect(bar()?.parentElement).toHaveClass('group/player');
  });
});
