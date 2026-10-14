import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Toast, ToastInline, ToastProvider, ToastViewport } from './Toast';

describe('Toast', () => {
  it('renders the title and description and can be closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast open onOpenChange={onOpenChange} title="Success" description="Your changes have been saved." variant="success" />
        <ToastViewport />
      </ToastProvider>,
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('maps variants to soft token classes', () => {
    render(
      <ToastProvider>
        <Toast open title="Error" variant="destructive" />
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText('Error').closest('li')).toHaveClass('bg-destructive-soft', 'border-destructive-soft-border');
  });
});

describe('ToastInline', () => {
  it('announces errors as alerts and the rest as status', () => {
    render(
      <>
        <ToastInline variant="destructive">Something went wrong.</ToastInline>
        <ToastInline variant="info">FYI</ToastInline>
      </>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
    expect(screen.getByRole('status')).toHaveTextContent('FYI');
  });

  it('shows a close button only when onClose is given', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<ToastInline>Message</ToastInline>);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

    rerender(<ToastInline onClose={onClose}>Message</ToastInline>);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows actions after the message, and each one works', async () => {
    const user = userEvent.setup();
    const onFix = vi.fn();
    render(
      <ToastInline variant="neutral" actions={<><button type="button">Dismiss</button><button type="button" onClick={onFix}>Fix</button></>}>
        Question type not supported.
      </ToastInline>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Question type not supported.');
    await user.click(screen.getByRole('button', { name: 'Fix' }));
    expect(onFix).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ToastInline variant="success" onClose={() => {}}>Saved</ToastInline>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
