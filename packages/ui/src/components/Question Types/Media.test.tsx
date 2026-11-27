import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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

describe('VideoPlayer more button and badge', () => {
  it('keeps "more" in the control bar by default', () => {
    render(<VideoPlayer name="Clip" />);
    expect(screen.getByRole('button', { name: 'More' }).closest('.bg-surface-foreground')).not.toBeNull();
  });

  it('moves "more" to a small ghost button beside the name with moreIn="info"', () => {
    const onMore = vi.fn();
    render(<VideoPlayer name="Clip" moreIn="info" onMore={onMore} />);
    const more = screen.getByRole('button', { name: 'More' });
    expect(more.closest('.bg-surface-foreground')).toBeNull();
    expect(more).toHaveClass('size-8');
    // On the name's line, not centred on the name and details together.
    expect(more.parentElement).toContainElement(screen.getByText('Clip'));
    fireEvent.click(more);
    expect(onMore).toHaveBeenCalledOnce();
  });

  it('lays the badge over the top-left corner of the video', () => {
    render(<VideoPlayer name="Clip" badge={<span>Neutral Sentiment</span>} />);
    expect(screen.getByText('Neutral Sentiment').parentElement).toHaveClass('absolute', 'top-3', 'left-3');
  });
});

describe('VideoPlayer aspect', () => {
  it('keeps the fixed 242px preview by default', () => {
    render(<VideoPlayer name="Clip" />);
    expect(screen.getByRole('button', { name: 'Play' }).closest('.group\\/player')).toHaveClass('h-60.5');
  });

  it('is 16:9 with aspect="video"', () => {
    render(<VideoPlayer name="Clip" aspect="video" />);
    const area = screen.getByRole('button', { name: 'Play' }).closest('.group\\/player');
    expect(area).toHaveClass('aspect-video');
    expect(area).not.toHaveClass('h-60.5');
  });
});

describe('MediaInfo compact', () => {
  it('keeps 16px by 24px padding by default and 16px all round with compactInfo', () => {
    const { unmount } = render(<VideoPlayer name="Clip" />);
    expect(screen.getByText('Clip').closest('.border-t')).toHaveClass('px-6', 'py-4');
    unmount();
    render(<VideoPlayer name="Clip" compactInfo />);
    const info = screen.getByText('Clip').closest('.border-t');
    expect(info).toHaveClass('p-4');
    expect(info).not.toHaveClass('px-6');
  });
});
