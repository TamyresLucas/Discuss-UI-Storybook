import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Badge } from './Badge';

const meta = {
  title: 'Tags & Badges/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The system badge: a category / role chip. `interactable` is a toggle that reveals a drag handle on hover. Source: Custom. Figma: Role Tag (41).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { type: { control: 'select', options: ['primary', 'secondary', 'question', 'interactable', 'id', 'count'] } },
  args: { children: 'Category', onClick: fn() },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge type="primary">Primary</Badge>
      <Badge type="secondary">Secondary</Badge>
      <Badge type="question">Select One</Badge>
      <Badge type="interactable">Interactable</Badge>
      <Badge type="interactable" selected>
        Selected
      </Badge>
      <Badge type="id">721347</Badge>
      <Badge type="count">3</Badge>
    </div>
  ),
};
export const Primary: Story = { args: { type: 'primary', children: 'Primary' } };
export const Secondary: Story = { args: { type: 'secondary' } };
export const QuestionType: Story = { args: { type: 'question', children: 'Select One' } };
export const Id: Story = { args: { type: 'id', children: '721347' } };
export const Count: Story = { args: { type: 'count', children: '3' } };
export const Interactable: Story = {
  args: { type: 'interactable' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Category' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const InteractableSelected: Story = { args: { type: 'interactable', selected: true } };
