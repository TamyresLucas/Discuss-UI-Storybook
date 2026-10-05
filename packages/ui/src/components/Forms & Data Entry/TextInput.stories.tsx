import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Input } from './Input';

const meta = {
  title: 'Forms & Data Entry/Text Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Standard single-line input field. Pass `label`, `description` and `message` to render the full field with helper text and success / error states. Source: shadcn. Figma: Text Input (19).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    status: { control: 'inline-radio', options: ['default', 'success', 'error'] },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'you@example.com', 'aria-label': 'Email' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await userEvent.type(input, 'hello@discuss.io');
    await expect(input).toHaveValue('hello@discuss.io');
  },
};
export const Disabled: Story = { args: { disabled: true } };

const field = { label: 'Email', description: 'Enter your email address', 'aria-label': undefined, placeholder: 'Email address' };
export const WithLabel: Story = { args: field };
export const Filled: Story = { args: { ...field, defaultValue: 'pietro@email.com' } };
export const Success: Story = {
  args: { ...field, defaultValue: 'pietro@email.com', status: 'success', message: 'Enter your email address' },
};
export const Error: Story = {
  args: { ...field, defaultValue: 'pietro@email', status: 'error', message: 'Enter your email address' },
};
