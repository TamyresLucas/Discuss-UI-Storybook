import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Slider } from './Slider';

const meta = {
  title: 'Forms & Data Entry/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Range slider. Optionally shows a label or min/max above the track and a value bubble over the thumb. Source: shadcn. Figma: Slider (26).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'Volume', max: 100, step: 10, onValueChange: fn() },
  decorators: [
    (Story) => (
      <div className="w-75 pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: [40] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: 'Volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenCalledWith([50]);
  },
};
export const Range: Story = { args: { defaultValue: [20, 80] } };

export const WithLabel: Story = { args: { defaultValue: [16], max: 40, step: 1, label: 'Label' } };
export const WithRangeAndValue: Story = { args: { defaultValue: [18], max: 40, step: 1, showRange: true, showValue: 'always' } };
