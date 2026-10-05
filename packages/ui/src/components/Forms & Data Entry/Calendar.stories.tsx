import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import * as React from 'react';

import { Calendar } from './Calendar';

const meta = {
  title: 'Forms & Data Entry/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Month calendar built on react-day-picker, with month / year pickers and optional recommended days (dashed). Source: shadcn. Figma: Calendar (25).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const september = new Date(2026, 8, 1);

function SelectableCalendar() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date(2026, 8, 23));
  return <Calendar mode="single" defaultMonth={september} selected={selected} onSelect={setSelected} />;
}

export const Default: Story = {
  render: () => <SelectableCalendar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /September 10th, 2026/ }));
    await expect(canvas.getByRole('button', { name: /September 10th, 2026/ })).toHaveAttribute('aria-selected', 'true');
  },
};

export const WithRecommendedDays: Story = {
  render: () => (
    <Calendar
      mode="single"
      defaultMonth={september}
      recommendedDates={[new Date(2026, 8, 14), new Date(2026, 8, 15)]}
      disabled={{ before: new Date(2026, 8, 5) }}
    />
  ),
};
