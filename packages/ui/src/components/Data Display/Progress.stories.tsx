import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from './Progress';

const meta = {
  title: 'Data Display/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Progress bar for project progress, video seek and storage usage, built on Radix Progress. Optional header and detail captions. Source: shadcn. Figma: Progress (36).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { value: { control: { type: 'range', min: 0, max: 100, step: 1 } } },
  args: { value: 64, 'aria-label': 'Project progress' },
  decorators: [
    (Story) => (
      <div className="w-120">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDetails: Story = {
  args: {
    label: 'Project Progress',
    valueLabel: true,
    detailsStart: '16 of 25 tasks completed',
    detailsEnd: 'Est. 3 days remaining',
  },
};
