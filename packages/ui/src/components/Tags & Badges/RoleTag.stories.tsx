import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RoleTag } from './RoleTag';

const meta = {
  title: 'Tags & Badges/Role Tag',
  component: RoleTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Category / role chip for research plans. `interactable` is a toggle that reveals a drag handle on hover. Source: Custom. Figma: Role Tag (41).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: { type: { control: 'select', options: ['primary', 'secondary', 'question', 'interactable'] } },
  args: { children: 'Category', onClick: fn() },
} satisfies Meta<typeof RoleTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { type: 'primary', children: 'Primary' } };
export const Secondary: Story = { args: { type: 'secondary' } };
export const QuestionType: Story = { args: { type: 'question', children: 'Select One' } };
export const Interactable: Story = {
  args: { type: 'interactable' },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Category' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const InteractableSelected: Story = { args: { type: 'interactable', selected: true } };
