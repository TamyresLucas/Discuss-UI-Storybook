import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ActivityStructure } from './ActivityStructure';

describe('ActivityStructure', () => {
  it('styles the title with the section text token', () => {
    render(<ActivityStructure title="Research Goal" stats={[]} />);
    expect(screen.getByRole('heading', { name: 'Research Goal' })).toHaveClass('text-body-section', 'text-primary');
  });

  it('shows the action at the right of the title, in the same row', () => {
    render(<ActivityStructure title="Activity Summary" stats={[]} action={<button type="button">Settings</button>} />);
    const heading = screen.getByRole('heading', { name: 'Activity Summary' });
    expect(heading.parentElement).toContainElement(screen.getByRole('button', { name: 'Settings' }));
    expect(heading.nextElementSibling).toBe(screen.getByRole('button', { name: 'Settings' }));
  });
});
