import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Textarea } from './Textarea';

const meta = {
  title: 'Forms & Data Entry/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Multi-line text area. Pass `label`, `description` and `message` to render the full field with helper text and success / error states. Source: shadcn. Figma: Textarea (20).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { status: { control: 'inline-radio', options: ['default', 'success', 'error'] } },
  args: { placeholder: 'Add a note...', 'aria-label': 'Note' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox', { name: 'Note' });
    await userEvent.type(textarea, 'Line one{enter}Line two');
    await expect(textarea).toHaveValue('Line one\nLine two');
  },
};
export const Disabled: Story = { args: { disabled: true } };

const field = { label: 'Description', description: 'Add a short description', 'aria-label': undefined, placeholder: 'Enter a description...' };
const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.';
export const WithLabel: Story = { args: field };
export const Filled: Story = { args: { ...field, defaultValue: lorem } };
export const Success: Story = { args: { ...field, defaultValue: lorem, status: 'success', message: 'Add a short description' } };
export const Error: Story = {
  args: { ...field, defaultValue: 'Lorem ipsum dolor sit amet, consect', status: 'error', message: 'Enter a valid description' },
};
