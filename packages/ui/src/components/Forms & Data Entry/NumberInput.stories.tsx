import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { NumberInput } from './NumberInput';

const meta = {
  title: 'Forms & Data Entry/Numerical Input',
  component: NumberInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Stepper for numeric values with a unit (e.g. 60 minutes). Arrow keys and the −/+ buttons change the value. Source: Custom. Figma: Numerical (23).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { status: { control: 'inline-radio', options: ['default', 'success', 'error'] } },
  args: { defaultValue: 60, step: 5, min: 0, unit: 'minutes', 'aria-label': 'Duration', onValueChange: fn() },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
    await expect(args.onValueChange).toHaveBeenCalledWith(65);
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }));
    await expect(canvas.getByRole('spinbutton', { name: 'Duration' })).toHaveValue('60');
  },
};
export const Error: Story = { args: { status: 'error', message: 'Enter a valid description' } };
