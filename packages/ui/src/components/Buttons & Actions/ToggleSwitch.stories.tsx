import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Switch } from './Switch';

const meta = {
  title: 'Buttons & Actions/Toggle (Switch)',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'On/off toggle with label (Translate, Autotranslate). Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'Autotranslate', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Autotranslate' });
    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
export const CheckedByDefault: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
