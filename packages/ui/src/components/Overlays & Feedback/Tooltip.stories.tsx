import { Info } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Buttons & Actions/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TooltipContentProps } from './Tooltip';

function Demo({ side = 'top', ...content }: Partial<TooltipContentProps>) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More info">
            <Info size={16} aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side} {...content} />
      </Tooltip>
    </TooltipProvider>
  );
}

const meta = {
  title: 'Overlays & Feedback/Tooltip',
  component: TooltipContent,
  subcomponents: { Tooltip, TooltipTrigger, TooltipProvider },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip on a Radix primitive. Simple is one line of text; Descriptive adds a title and description; Rich adds an action link. Source: shadcn. Figma: Tooltip (51).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] }, arrow: { control: 'boolean' } },
  decorators: [
    (Story) => (
      <div className="flex h-48 w-80 items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const description = 'Brief description that provides additional context about the element.';

export const Simple: Story = { render: (args) => <Demo {...args} />, args: { children: 'Tooltip text' } };
export const SimpleBelow: Story = { render: (args) => <Demo {...args} />, args: { children: 'Tooltip text', side: 'bottom' } };
export const Descriptive: Story = { render: (args) => <Demo {...args} />, args: { title: 'Tooltip title', description } };
export const Rich: Story = {
  render: (args) => <Demo {...args} />,
  args: { title: 'Tooltip title', description, action: <a href="#learn-more">Learn more</a> },
};
export const NoArrow: Story = { render: (args) => <Demo {...args} />, args: { children: 'Tooltip text', arrow: false } };
