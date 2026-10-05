import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Button } from './Button';

/** A generic glyph standing in until an icon set is added to the system. */
const SettingsGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.36 3.64l-1.41 1.41M5.05 10.95l-1.41 1.41M12.36 12.36l-1.41-1.41M5.05 5.05L3.64 3.64"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const meta = {
  title: 'Buttons & Actions/Button (Icon-only)',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small square button with only an icon (settings, download). Always pair with an aria-label since there is no visible text. Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'outline', 'ghost'] },
  },
  args: { variant: 'ghost', size: 'sm', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { 'aria-label': 'Settings', className: 'w-8 px-0' },
  render: (args) => (
    <Button {...args}>
      <SettingsGlyph />
    </Button>
  ),
};
