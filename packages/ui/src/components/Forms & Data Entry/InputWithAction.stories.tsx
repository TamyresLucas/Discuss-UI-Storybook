import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { EditableTag } from '../Tags & Badges/EditableTag';
import { InputWithAction } from './InputWithAction';

const meta = {
  title: 'Forms & Data Entry/Input with Action',
  component: InputWithAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Input with a trailing action button (e.g. Invite). Pass `tags` to show chips inside the field. Source: Custom. Figma: Input + button (19).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: { actionLabel: 'Invite', placeholder: 'Add coma to separate emails', 'aria-label': 'Emails', onAction: fn() },
} satisfies Meta<typeof InputWithAction>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = (
  <>
    <EditableTag type="editable" onRemove={() => {}}>
      Tamyres
    </EditableTag>
    <EditableTag type="editable" onRemove={() => {}}>
      Murilo
    </EditableTag>
    <EditableTag type="add">Taryn</EditableTag>
  </>
);

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Invite' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
};
export const WithSupportText: Story = { args: { description: 'Support text' } };
export const WithTags: Story = { args: { tags } };
export const Error: Story = { args: { tags, status: 'error', message: 'Error message' } };
