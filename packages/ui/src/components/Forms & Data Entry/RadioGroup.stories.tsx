import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Label } from './Label';
import { RadioGroup, RadioGroupFieldItem, RadioGroupItem } from './RadioGroup';

const meta = {
  title: 'Forms & Data Entry/Radio Group',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Single-select option group for exclusive choices. `RadioGroupFieldItem` lays out the label and optional description. Source: shadcn. Figma: Radio Group (24).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { 'aria-label': 'Language', onValueChange: fn(), defaultValue: 'en' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="en" id="lang-en" />
        <Label htmlFor="lang-en">English</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pt" id="lang-pt" />
        <Label htmlFor="lang-pt">Portuguese</Label>
      </div>
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const english = canvas.getByRole('radio', { name: 'English' });
    const portuguese = canvas.getByRole('radio', { name: 'Portuguese' });
    await expect(english).toBeChecked();

    await userEvent.click(portuguese);

    await expect(portuguese).toBeChecked();
    await expect(english).not.toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('pt');
  },
};

export const WithDescriptions: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroupFieldItem value="en" label="Radio option" description="Additional description text for this option." />
      <RadioGroupFieldItem value="pt" label="Radio option" description="Additional description text for this option." />
      <RadioGroupFieldItem value="es" disabled label="Radio option" description="Additional description text for this option." />
    </RadioGroup>
  ),
};
