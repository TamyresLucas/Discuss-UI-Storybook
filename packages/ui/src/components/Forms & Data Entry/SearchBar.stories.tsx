import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { SearchBar } from './SearchBar';

const meta = {
  title: 'Forms & Data Entry/Search Bar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Search field with a magnifying glass and a clear (×) button once there is text. Source: Custom. Figma: Search Bar (18).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { placeholder: 'Search...', 'aria-label': 'Search' },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search' });
    await userEvent.type(input, 'onboarding');
    await expect(input).toHaveValue('onboarding');
  },
};

export const Filled: Story = {
  args: { defaultValue: 'Design systems' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search' });
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
  },
};
