import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'Forms & Data Entry/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Checkbox with label and description text. Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'Accept terms', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
export const CheckedByDefault: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
