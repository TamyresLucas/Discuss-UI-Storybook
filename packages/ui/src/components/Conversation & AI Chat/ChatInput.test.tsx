import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup } from '../Forms & Data Entry/RadioGroup';
import { ChatChoices, ChatOption } from './ChatChoices';
import { AskAiInput, ChatInput } from './ChatInput';
import { ProjectSelector } from './ProjectSelector';

describe('ChatInput', () => {
  it('disables send until there is text, then submits on click', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);

    const send = screen.getByRole('button', { name: 'Send' });
    expect(send).toBeDisabled();
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'Hello');
    expect(send).toBeEnabled();
    await user.click(send);
    expect(onSubmit).toHaveBeenCalledWith('Hello');
  });

  it('submits on Enter but keeps Shift+Enter for a new line', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);

    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'a{Shift>}{Enter}{/Shift}b');
    expect(onSubmit).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('a\nb');
  });

  it('shows the add button only when onAdd is provided', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const { rerender } = render(<ChatInput />);
    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();

    rerender(<ChatInput onAdd={onAdd} />);
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('has a round send button', () => {
    render(<ChatInput />);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveClass('rounded-full');
  });

  it('can send with only an attachment', () => {
    render(<ChatInput attachments={<span>file</span>} />);
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ChatInput onAdd={() => {}} trailing={<ProjectSelector />} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AskAiInput', () => {
  it('submits the typed text', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AskAiInput aria-label="Ask AI" onSubmit={onSubmit} />);

    await user.type(screen.getByRole('textbox', { name: 'Ask AI' }), 'I want{enter}');
    expect(onSubmit).toHaveBeenCalledWith('I want');
  });
});

describe('ProjectSelector', () => {
  it('is a menu trigger by default and read-only when selected', () => {
    const { rerender } = render(<ProjectSelector />);
    expect(screen.getByRole('button', { name: 'New Project' })).toHaveAttribute('aria-haspopup', 'menu');

    rerender(<ProjectSelector project="Customer satisfaction" selected />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Customer satisfaction')).toBeInTheDocument();
  });
});

describe('ProjectSelector menu', () => {
  it('opens a menu with New Project checked, then picks an existing project', async () => {
    const user = userEvent.setup();
    const onProjectChange = vi.fn();
    render(<ProjectSelector projects={['Meal kit retention']} onProjectChange={onProjectChange} />);

    await user.click(screen.getByRole('button', { name: 'New Project' }));
    expect(await screen.findByRole('menuitemradio', { name: 'New Project' })).toBeChecked();

    await user.click(screen.getByRole('menuitemradio', { name: 'Meal kit retention' }));
    expect(onProjectChange).toHaveBeenCalledWith('Meal kit retention');
  });

  it('reports undefined when New Project is chosen again', async () => {
    const user = userEvent.setup();
    const onProjectChange = vi.fn();
    render(<ProjectSelector project="Meal kit retention" projects={['Meal kit retention']} onProjectChange={onProjectChange} />);

    await user.click(screen.getByRole('button', { name: 'Meal kit retention' }));
    expect(await screen.findByRole('menuitemradio', { name: 'Meal kit retention' })).toBeChecked();
    await user.click(screen.getByRole('menuitemradio', { name: 'New Project' }));
    expect(onProjectChange).toHaveBeenCalledWith(undefined);
  });
});

describe('ChatChoices', () => {
  it('fires an action option', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChatChoices title="Which method?">
        <ChatOption title="Looks right" description="Move on." onClick={onClick} />
      </ChatChoices>,
    );
    await user.click(screen.getByRole('button', { name: /Looks right/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('selects radio and checkbox options', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onCheckedChange = vi.fn();
    render(
      <>
        <RadioGroup aria-label="Method" onValueChange={onValueChange}>
          <ChatOption kind="radio" value="human" title="Human-Led" description="Talk directly." />
        </RadioGroup>
        <ChatOption kind="checkbox" title="Observers" onCheckedChange={onCheckedChange} />
      </>,
    );

    await user.click(screen.getByText('Human-Led'));
    expect(onValueChange).toHaveBeenCalledWith('human');
    expect(screen.getByRole('radio', { name: 'Human-Led' })).toHaveAccessibleDescription('Talk directly.');

    await user.click(screen.getByText('Observers'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
