import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox, CheckboxField } from './Checkbox';

const meta = {
  title: 'Forms & Data Entry/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox, plus `CheckboxField` for the label + description layout. Supports the indeterminate state. Source: shadcn. Figma: Checkbox (21).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'Accept terms', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Accept terms' });
    await expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
export const CheckedByDefault: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Indeterminate: Story = { args: { checked: 'indeterminate' } };
export const WithLabel: Story = {
  render: () => <CheckboxField label="Accept terms and conditions" />,
};
export const WithDescription: Story = {
  render: () => (
    <CheckboxField label="Accept terms and conditions" description="You agree to our Terms of Service and Privacy Policy." />
  ),
};
export const IndeterminateWithDescription: Story = {
  render: () => <CheckboxField checked="indeterminate" label="Select all" description="Some items are selected." />,
};
export const DisabledWithDescription: Story = {
  render: () => (
    <CheckboxField disabled defaultChecked label="Accept terms and conditions" description="You agree to our Terms of Service and Privacy Policy." />
  ),
};
