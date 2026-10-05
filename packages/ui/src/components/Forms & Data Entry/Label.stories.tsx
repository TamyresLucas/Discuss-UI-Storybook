import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';
import { Label } from './Label';

const meta = {
  title: 'Forms & Data Entry/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Form field labels paired with inputs. Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Email', htmlFor: 'story-email' } };
export const PairedWithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label {...args} />
      <Input id="story-email" placeholder="you@example.com" />
    </div>
  ),
  args: { children: 'Email', htmlFor: 'story-email' },
};
