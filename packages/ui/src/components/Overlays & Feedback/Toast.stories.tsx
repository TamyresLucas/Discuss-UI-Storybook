import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import { Toast, ToastAction, ToastInline, ToastProvider, ToastViewport, type ToastVariant } from './Toast';

const copy: Record<ToastVariant, { title: string; description: string }> = {
  info: { title: 'Heads up!', description: 'You can add components to your app using the cli.' },
  success: { title: 'Success', description: 'Your changes have been saved successfully.' },
  warning: { title: 'Warning', description: 'Your session is about to expire. Please save your work.' },
  destructive: { title: 'Error', description: 'Something went wrong. Please try again later.' },
};

function ToastDemo({ variant, withAction }: { variant: ToastVariant; withAction?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <ToastProvider>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show toast
      </Button>
      <Toast variant={variant} open={open} onOpenChange={setOpen} duration={Infinity} {...copy[variant]}
        action={withAction ? <ToastAction altText="Undo the change" asChild><Button size="sm" variant="outline">Undo</Button></ToastAction> : undefined}
      />
      <ToastViewport />
    </ToastProvider>
  );
}

const meta = {
  title: 'Overlays & Feedback/Toast (Sonner)',
  component: ToastDemo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Transient notification built on Radix Toast (info / success / warning / destructive), plus `ToastInline` for single-line in-page banners. Source: shadcn. Figma: Toast / Sonner (52).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  argTypes: { variant: { control: 'select', options: ['info', 'success', 'warning', 'destructive'] } },
  args: { variant: 'info' },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Show toast' }));
    const toast = await within(document.body).findByText('Heads up!');
    await expect(toast).toBeInTheDocument();
    await userEvent.click(within(document.body).getByRole('button', { name: 'Close' }));
  },
};
export const Success: Story = { args: { variant: 'success' } };
export const Warning: Story = { args: { variant: 'warning' } };
export const Destructive: Story = { args: { variant: 'destructive', withAction: true } };

export const InlineWithActions: Story = {
  render: () => {
    const actions = (
      <>
        <Button size="sm" variant="ghost">Dismiss</Button>
        <Button size="sm" variant="outline">Fix</Button>
      </>
    );
    return (
      <div className="flex w-110 flex-col gap-4">
        <ToastInline variant="neutral" actions={actions}>Enable Candidate Availability Collection.</ToastInline>
        <ToastInline variant="warning" actions={actions}>Enable Candidate Availability Collection.</ToastInline>
        <ToastInline variant="destructive" actions={actions}>Question type not supported.</ToastInline>
      </div>
    );
  },
};

export const Inline: Story = {
  render: () => (
    <div className="flex w-110 flex-col gap-4">
      <ToastInline variant="info" onClose={() => {}}>You can add components to your app using the cli.</ToastInline>
      <ToastInline variant="success" onClose={() => {}}>Your changes have been saved successfully.</ToastInline>
      <ToastInline variant="warning" onClose={() => {}}>Your session is about to expire.</ToastInline>
      <ToastInline variant="destructive" onClose={() => {}}>Something went wrong. Please try again later.</ToastInline>
    </div>
  ),
};
