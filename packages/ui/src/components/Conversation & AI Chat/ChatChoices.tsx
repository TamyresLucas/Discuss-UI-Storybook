import * as React from 'react';

import { cn } from '../../lib/utils';
import { Checkbox } from '../Forms & Data Entry/Checkbox';
import { RadioGroupItem } from '../Forms & Data Entry/RadioGroup';

export interface ChatChoicesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The question the assistant is asking. */
  title: React.ReactNode;
}

// Figma: Chat Input (56) › Choices — a question header over a list of options, shown above the input.
export const ChatChoices = React.forwardRef<HTMLDivElement, ChatChoicesProps>(
  ({ className, title, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col', className)} {...props}>
      <div className="border-b border-border px-6 pt-5 pb-4">
        <p className="text-body-section text-surface-foreground">{title}</p>
      </div>
      {children}
    </div>
  ),
);
ChatChoices.displayName = 'ChatChoices';

interface ChatOptionBaseProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export interface ChatOptionActionProps
  extends ChatOptionBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  kind?: 'action';
}

export interface ChatOptionRadioProps extends ChatOptionBaseProps {
  kind: 'radio';
  /** Value in the surrounding `RadioGroup`. */
  value: string;
  disabled?: boolean;
}

export interface ChatOptionCheckboxProps extends ChatOptionBaseProps {
  kind: 'checkbox';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export type ChatOptionProps = ChatOptionActionProps | ChatOptionRadioProps | ChatOptionCheckboxProps;

const rowClasses = 'flex w-full flex-col gap-1 border-b border-border px-6 py-4 text-left text-body-small';

// Figma: Chat Input (56) › AI option — a quick reply (action), or a radio / checkbox choice with a description.
export function ChatOption(props: ChatOptionProps) {
  const id = React.useId();
  const descriptionId = `${id}-description`;

  if (props.kind === 'radio' || props.kind === 'checkbox') {
    const { title, description, className } = props;
    const control =
      props.kind === 'radio' ? (
        <RadioGroupItem id={id} value={props.value} disabled={props.disabled} aria-describedby={description ? descriptionId : undefined} />
      ) : (
        <Checkbox
          id={id}
          checked={props.checked}
          defaultChecked={props.defaultChecked}
          onCheckedChange={(next) => props.onCheckedChange?.(next === true)}
          disabled={props.disabled}
          aria-describedby={description ? descriptionId : undefined}
        />
      );
    return (
      <div className={cn(rowClasses, 'cursor-default', className)}>
        <div className="flex items-center gap-2.5 py-1">
          {control}
          <label htmlFor={id} className="text-ui-label text-surface-foreground">
            {title}
          </label>
        </div>
        {description && (
          <p id={descriptionId} className="pl-7.75 text-sm leading-[1.4] text-secondary-muted-foreground">
            {description}
          </p>
        )}
      </div>
    );
  }

  const { title, description, className, kind: _kind, ...buttonProps } = props;
  return (
    <button
      type="button"
      className={cn(rowClasses, 'transition-colors hover:bg-accent-soft', className)}
      {...buttonProps}
    >
      <span className="text-ui-label text-surface-foreground">{title}</span>
      {description && <span className="text-body-small text-secondary-muted-foreground">{description}</span>}
    </button>
  );
}
