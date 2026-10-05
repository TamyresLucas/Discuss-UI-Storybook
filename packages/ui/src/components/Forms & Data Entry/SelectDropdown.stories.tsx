import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Gear } from '@phosphor-icons/react';

import { Field } from './Field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

const meta = {
  title: 'Forms & Data Entry/Select (Dropdown)',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Full select with dropdown (timezone, language). Compose with `Field` for a label, and pass `icon` to `SelectTrigger` for the leading glyph. Source: shadcn. Figma: Select / Dropdown (22).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { onValueChange: fn() },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Language">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Language' });
    await expect(trigger).toHaveTextContent('Select a language');

    await userEvent.click(trigger);
    // Radix Select renders its listbox in a portal outside canvasElement, so
    // the open options are queried from the full document instead of canvas.
    const option = await within(document.body).findByRole('option', { name: 'Portuguese' });
    await userEvent.click(option);

    await expect(trigger).toHaveTextContent('Portuguese');
    await expect(args.onValueChange).toHaveBeenCalledWith('pt');
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="w-80">
      <Field label="Category">
        {(control) => (
          <Select {...args}>
            <SelectTrigger {...control}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
        )}
      </Field>
    </div>
  ),
};
export const WithIcon: Story = {
  render: (args) => (
    <div className="w-80">
      <Select {...args} defaultValue="design">
        <SelectTrigger aria-label="Category" icon={<Gear size={16} aria-hidden />}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="research">Research</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
