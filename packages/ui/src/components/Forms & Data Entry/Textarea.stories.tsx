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
        component: 'Multi-line text area. Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
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
