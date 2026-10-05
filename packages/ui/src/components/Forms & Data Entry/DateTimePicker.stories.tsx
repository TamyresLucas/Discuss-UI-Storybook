import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { DatePicker, DateTimePicker } from './DateTimePicker';

const meta = {
  title: 'Forms & Data Entry/Date & Time Picker',
  component: DateTimePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '`DateTimePicker` is the card with calendar, optional time columns and Reset / Apply. `DatePicker` is the field-style trigger that opens it in a popover. Source: Custom. Figma: Calendar (25).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { defaultValue: new Date(2026, 8, 23, 11, 30), onApply: fn(), onReset: fn() },
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateAndTime: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /September 10th, 2026/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(args.onApply).toHaveBeenCalledTimes(1);
  },
};
export const DateOnly: Story = { args: { showTime: false } };

export const Trigger: Story = {
  render: () => <DatePicker label="Select date and time" defaultValue={new Date(2026, 8, 23, 11, 30)} />,
};
