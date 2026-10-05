import { Sparkle } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Toggle } from './Toggle';

const meta = {
  title: 'Buttons & Actions/Toggle (Menu)',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Icon toggle button that fills when pressed (e.g. the AI assistant menu). Built on Radix Toggle. Source: shadcn. Figma: Toggle / Switch (17) › Toggle menu.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'AI assistant', onPressedChange: fn(), children: <Sparkle size={16} aria-hidden /> },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'AI assistant' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenCalledWith(true);
  },
};
export const Pressed: Story = {
  args: { defaultPressed: true, children: <Sparkle size={16} weight="fill" aria-hidden /> },
};
export const Disabled: Story = { args: { disabled: true } };
