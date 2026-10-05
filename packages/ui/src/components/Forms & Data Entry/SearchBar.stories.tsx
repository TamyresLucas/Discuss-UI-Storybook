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
        component: 'Input with magnifying glass icon and placeholder text. Source: Custom.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  args: { placeholder: 'Search sessions...', 'aria-label': 'Search' },
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
