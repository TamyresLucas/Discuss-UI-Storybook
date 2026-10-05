import { Plus } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Buttons & Actions/Button (Primary)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Filled button with icon + label (New activity, Join Meeting), plus the destructive and link types. Source: shadcn. Figma: Buttons (13).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive', 'link'] },
    size: { control: 'select', options: ['md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'default', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'New activity' },
  render: (args) => (
    <Button {...args}>
      <Plus size={16} aria-hidden />
      {args.children}
    </Button>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'New activity' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const Destructive: Story = {
  args: { children: 'Destructive', variant: 'destructive' },
  render: Default.render,
};
export const Link: Story = { args: { children: 'Link', variant: 'link' } };
export const Disabled: Story = {
  args: { children: 'New activity', disabled: true },
  render: Default.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'New activity' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
