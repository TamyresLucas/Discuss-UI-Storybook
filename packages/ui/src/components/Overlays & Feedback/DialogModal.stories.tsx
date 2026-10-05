import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import { Input } from '../Forms & Data Entry/Input';
import { Label } from '../Forms & Data Entry/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Forms & Data Entry/Select';
import { Textarea } from '../Forms & Data Entry/Textarea';
import { EditableTag } from '../Tags & Badges/EditableTag';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

const Required = ({ children }: { children: string }) => (
  <>
    {children} <span className="text-destructive">*</span>
  </>
);

const meta = {
  title: 'Overlays & Feedback/Dialog (Modal)',
  component: Dialog,
  subcomponents: { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal dialog on Radix Dialog: header, body and footer sections on a scrim. Focus is trapped and Escape closes it. Source: shadcn. Figma: Dialog / Modal (48).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateProject: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Fill in the details below to create your project.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <Input label={<Required>Project Name</Required>} placeholder="Name your project" />
          <Textarea
            label={<Required>Research Goal</Required>}
            description="0/2000 characters"
            placeholder="e.g., Deliver a prioritized list of usability barriers in the checkout flow, supported by behavioral evidence and severity ratings, to guide the product team's Q4 redesign decisions."
          />
          <div className="flex flex-col gap-1.5">
            <Label>
              <Required>Language</Required>
            </Label>
            <Select defaultValue="en-US">
              <SelectTrigger aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="pt-BR">Portuguese (Brazil)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <Label>
                <Required>Tags</Required>
              </Label>
              <Select>
                <SelectTrigger aria-label="Tags">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roadmap">Q3 Roadmap</SelectItem>
                  <SelectItem value="usability">Usability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <EditableTag type="editable" onRemove={() => {}}>
                Q3 Roadmap
              </EditableTag>
              <EditableTag type="editable" onRemove={() => {}}>
                Usability
              </EditableTag>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Create project' }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Create Project' });
    await expect(dialog).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};
