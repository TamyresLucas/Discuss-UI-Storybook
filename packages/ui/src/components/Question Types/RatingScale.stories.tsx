import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RatingScale } from './RatingScale';

const meta = {
  title: 'Question Types/Rating Scale',
  component: RatingScale,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A row of numbered buttons for a rating question (Radix Toggle Group). Optional captions under the first and last point. Source: Custom. Figma: Rating scale item.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-107.5"><Story /></div>],
  args: { 'aria-label': 'Likelihood to recommend', lowLabel: 'Not likely', highLabel: 'Very likely', onValueChange: fn() },
} satisfies Meta<typeof RatingScale>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('radio', { name: '4' }));
    await expect(args.onValueChange).toHaveBeenCalledWith(4);
  },
};
export const Selected: Story = { args: { defaultValue: 4 } };
export const TenPoints: Story = { args: { max: 10, lowLabel: '0', highLabel: '10' } };
