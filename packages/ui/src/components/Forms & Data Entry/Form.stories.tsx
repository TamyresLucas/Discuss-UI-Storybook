import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '../Buttons & Actions/Button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';
import { Input } from './Input';

interface SignupValues {
  email: string;
}

function SignupForm({ onSubmit }: { onSubmit: (values: SignupValues) => void }) {
  const form = useForm<SignupValues>({ defaultValues: { email: '' } });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll only use this to send you a receipt.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign up</Button>
      </form>
    </Form>
  );
}

const meta = {
  title: 'Forms & Data Entry/Form',
  component: SignupForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Form wrapper with validation states, built on react-hook-form. Source: shadcn.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-shadcn'],
  args: { onSubmit: fn() },
} satisfies Meta<typeof SignupForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ValidationError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await expect(await canvas.findByText('Email is required')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const SubmitsWhenValid: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'hello@discuss.io');
    await userEvent.click(canvas.getByRole('button', { name: 'Sign up' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ email: 'hello@discuss.io' }, expect.anything());
  },
};
