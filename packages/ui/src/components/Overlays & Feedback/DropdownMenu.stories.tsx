import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta = {
  title: 'Overlays & Feedback/Dropdown Menu',
  component: DropdownMenu,
  subcomponents: { DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioItem, DropdownMenuSubTrigger },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Action / option menu built on Radix Dropdown Menu. Items support descriptions, a destructive style, a selected state with a check, and submenus. Source: shadcn. Figma: Dropdown Menu (50).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function TeamMenu() {
  const [team, setTeam] = React.useState('design');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Team</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={team} onValueChange={setTeam}>
          <DropdownMenuRadioItem value="design">Design</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="engineering">Engineering</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="product">Product</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sales">Sales</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Selectable: Story = {
  render: () => <TeamMenu />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Team' }));
    const menu = within(document.body);
    await expect(await menu.findByRole('menuitemradio', { name: 'Design' })).toBeChecked();
    await userEvent.click(menu.getByRole('menuitemradio', { name: 'Marketing' }));
  },
};

export const WithActions: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem description="Description text">Option</DropdownMenuItem>
        <DropdownMenuItem>Option</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Sub option</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
