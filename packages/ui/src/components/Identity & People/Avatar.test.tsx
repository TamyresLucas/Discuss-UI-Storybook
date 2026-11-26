import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';
import { OrgMonogram } from './OrgMonogram';

describe('Avatar', () => {
  it('shows the photo with the name as alt text', () => {
    render(<Avatar src="me.png" name="Tamyres Lucas" />);
    expect(screen.getByRole('img', { name: 'Tamyres Lucas' })).toHaveAttribute('src', 'me.png');
  });

  it('shows the initials without a photo, named for screen readers', () => {
    render(<Avatar name="Tamyres Lucas" />);
    expect(screen.getByRole('img', { name: 'Tamyres Lucas' })).toHaveTextContent('TL');
  });

  it('falls back to the initials when the photo fails', () => {
    render(<Avatar src="broken.png" name="Ada" fallback="A" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveTextContent('A');
  });

  it('is a 40px rounded square on orchid-200', () => {
    render(<Avatar name="Ada" />);
    expect(screen.getByRole('img')).toHaveClass('size-10', 'rounded-md', 'bg-orchid-200');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Avatar name="Ada" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('OrgMonogram', () => {
  it('is a 40px coral square with the initial', () => {
    render(<OrgMonogram>D</OrgMonogram>);
    expect(screen.getByText('D')).toHaveClass('size-10', 'bg-coral-500', 'text-surface');
  });
});
