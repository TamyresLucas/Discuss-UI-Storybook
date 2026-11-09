import type { Meta, StoryObj } from '@storybook/react-vite';

import { Step, StepPath, Stepper } from './Stepper';

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  subcomponents: { Step, StepPath },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The steps of a flow joined by paths: the steps before `current` are completed, a path between two completed steps is green. Horizontal puts each label under its indicator; vertical puts it before. Figma: Stepper (785:557).',
      },
    },
  },
  tags: ['autodocs', 'status:review'],
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  args: { 'aria-label': 'Progress', steps: [{ label: 'Step' }, { label: 'Step' }, { label: 'Step' }], current: 0, orientation: 'horizontal' },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "In use", first row: the first step selected. */
export const FirstStep: Story = { render: (args) => <div className="w-145"><Stepper {...args} /></div> };

/** Second row: the first completed, the second selected. */
export const SecondStep: Story = { args: { current: 1 }, render: (args) => <div className="w-145"><Stepper {...args} /></div> };

/** Third row: two completed (the path between them is green), the last selected. */
export const LastStep: Story = { args: { current: 2 }, render: (args) => <div className="w-145"><Stepper {...args} /></div> };

export const WithError: Story = { args: { current: 2, steps: [{ label: 'Upload' }, { label: 'Check', error: true }, { label: 'Publish' }] }, render: (args) => <div className="w-145"><Stepper {...args} /></div> };

export const Vertical: Story = { args: { current: 1, orientation: 'vertical' } };

/** The 12 step variants: not completed, completed and error, each not selected and selected, in both layouts. */
export const AllSteps: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['vertical', 'horizontal'] as const).map((orientation) => (
        <div key={orientation} className="flex">
          {(['not-completed', 'completed', 'error'] as const).flatMap((status) =>
            [false, true].map((selected) => <Step key={`${status}-${selected}`} label="Step" status={status} selected={selected} orientation={orientation} />),
          )}
        </div>
      ))}
      <div className="flex items-start gap-8">
        <StepPath className="w-48" />
        <StepPath completed className="w-48" />
        <StepPath orientation="vertical" className="h-24" />
      </div>
    </div>
  ),
};
