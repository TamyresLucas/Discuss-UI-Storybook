import * as React from 'react';
import { Slot } from 'radix-ui';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form';

import { cn } from '../../lib/utils';
import { Label } from './Label';

export const Form = FormProvider;

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext?.name });

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>');
  }
  if (!itemContext) {
    throw new Error('useFormField must be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

// Deliberately not `ComponentPropsWithoutRef<typeof Label>` — that type
// transitively references a private @radix-ui/react-label type that tsup's
// declaration build can't re-export portably. Label's own prop surface is
// just native label attributes, so this is equivalent.
export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormField();
    return (
      <Label
        ref={ref}
        htmlFor={formItemId}
        className={cn(error && 'text-destructive-foreground', className)}
        {...props}
      />
    );
  },
);
FormLabel.displayName = 'FormLabel';

export type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot.Root>;

export const FormControl = React.forwardRef<React.ElementRef<typeof Slot.Root>, FormControlProps>((props, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot.Root
      ref={ref}
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('text-sm text-secondary-muted-foreground', className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = 'FormDescription';

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn('text-sm text-destructive-foreground', className)} {...props}>
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';
