import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

function Menu({ onSelect = vi.fn(), onDelete = vi.fn() }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={onSelect} description="Description text">
          Option
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens with the keyboard and shows items with their descriptions', async () => {
    const user = userEvent.setup();
    render(<Menu />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('menuitem', { name: /Option/ })).toHaveTextContent('Description text');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });

  it('fires onSelect for the chosen item and closes', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<Menu onDelete={onDelete} />);

    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('marks the selected radio item as checked', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Team</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="design">
            <DropdownMenuRadioItem value="design">Design</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sales">Sales</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    screen.getByRole('button', { name: 'Team' }).focus();
    await user.keyboard('{Enter}');

    expect(await screen.findByRole('menuitemradio', { name: 'Design' })).toBeChecked();
    expect(screen.getByRole('menuitemradio', { name: 'Sales' })).not.toBeChecked();
  });

  it('has no accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Menu />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    expect(await axe(container)).toHaveNoViolations();
  });
});
