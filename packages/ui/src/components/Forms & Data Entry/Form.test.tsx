import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';
import { Input } from './Input';

interface Values {
  email: string;
}

function EmailForm({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>We'll only use this to send you a receipt.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe('Form', () => {
  it('associates the label, description, and control via aria-describedby', () => {
    render(<EmailForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAccessibleDescription("We'll only use this to send you a receipt.");
  });

  it('shows a validation message and marks the field invalid on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EmailForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the values once valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EmailForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'hello@discuss.io');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: 'hello@discuss.io' }, expect.anything()));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EmailForm onSubmit={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
