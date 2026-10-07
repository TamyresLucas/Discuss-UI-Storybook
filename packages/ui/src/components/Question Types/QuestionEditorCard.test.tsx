import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { ActivityStructure } from '../Research-Specific/ActivityStructure';
import { StatCard } from '../Data Display/StatCard';
import { QuestionEditorCard } from './QuestionEditorCard';
import { QuestionNavItem } from './QuestionNavItem';

describe('QuestionEditorCard', () => {
  it('hides counter and footer until active', () => {
    const { rerender } = render(<QuestionEditorCard number={1} title="Hi" countLabel="4/20 choices" onAdd={() => {}} />);
    expect(screen.queryByText('4/20 choices')).not.toBeInTheDocument();
    expect(screen.queryByText(/characters/)).not.toBeInTheDocument();
    rerender(<QuestionEditorCard active number={1} title="Hi" countLabel="4/20 choices" onAdd={() => {}} />);
    expect(screen.getByText('4/20 choices')).toBeInTheDocument();
    expect(screen.getByText('2/2000 characters')).toBeInTheDocument();
  });

  it('wires header and footer actions', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onAdd = vi.fn();
    render(<QuestionEditorCard active number={1} title="Hi" onDelete={onDelete} onAdd={onAdd} />);
    await user.click(screen.getByRole('button', { name: 'Delete question' }));
    await user.click(screen.getByRole('button', { name: 'Add choice' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('shows the add-choice action as an outline button with a visible label', () => {
    render(<QuestionEditorCard active number={1} title="Hi" onAdd={() => {}} onPaste={() => {}} />);
    const add = screen.getByRole('button', { name: 'Add choice' });
    expect(add).toHaveTextContent('Add choice');
    expect(add).toHaveClass('border');
    expect(screen.getByRole('button', { name: 'Paste choices' })).not.toHaveTextContent('Paste');
  });

  it('reveals the header actions when the whole card is hovered or focused, not only the header', () => {
    render(<QuestionEditorCard number={1} title="Hi" onDelete={() => {}} />);
    const actions = screen.getByRole('button', { name: 'Delete question' }).parentElement!;
    expect(actions).toHaveClass('group-hover/editor:opacity-100', 'group-focus-within/editor:opacity-100');
  });

  it('gives the number tag its hover look (grip icon, tighter left padding) when the whole card is hovered', () => {
    render(<QuestionEditorCard number={1} title="Hi" dragHandleProps={{ role: 'button', tabIndex: 0 }} />);
    const tag = screen.getByRole('button', { name: 'Reorder question 1' });
    expect(tag).toHaveClass('group-hover/editor:pl-1');
    expect(tag.querySelector('svg')).toHaveClass('group-hover/editor:block');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<QuestionEditorCard active number={1} title="Hi" countLabel="1/20" onAdd={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('QuestionNavItem', () => {
  it('marks the selected row and flags errors for screen readers', () => {
    render(
      <>
        <QuestionNavItem selected>One</QuestionNavItem>
        <QuestionNavItem error>Two</QuestionNavItem>
      </>,
    );
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Two, has errors' })).not.toHaveAttribute('aria-current');
  });

  it('hover changes only the fill: the border stays default unless selected', () => {
    const { rerender } = render(<QuestionNavItem>One</QuestionNavItem>);
    const idle = screen.getByRole('button');
    expect(idle).toHaveClass('border-border', 'hover:bg-accent-soft');
    expect(idle).not.toHaveClass('hover:border-input-accent');
    rerender(<QuestionNavItem selected>One</QuestionNavItem>);
    const selected = screen.getByRole('button');
    expect(selected).toHaveClass('border-input-accent');
    expect(selected).not.toHaveClass('border-border');
  });

  it('shows the type icon muted, and in the accent colour when selected', () => {
    const { container, rerender } = render(<QuestionNavItem questionType="open-end">One</QuestionNavItem>);
    expect(container.querySelector('svg.text-muted-foreground')).toBeInTheDocument();
    expect(container.querySelector('svg.text-accent-foreground')).not.toBeInTheDocument();
    rerender(<QuestionNavItem questionType="open-end" selected>One</QuestionNavItem>);
    expect(container.querySelector('svg.text-accent-foreground')).toBeInTheDocument();
    expect(container.querySelector('svg.text-muted-foreground')).not.toBeInTheDocument();
  });

  it('keeps the warning icon destructive whether or not it is selected', () => {
    const { container } = render(<QuestionNavItem error>One</QuestionNavItem>);
    expect(container.querySelector('svg.text-destructive')).toBeInTheDocument();
    expect(container.querySelector('svg.text-muted-foreground')).not.toBeInTheDocument();
  });

  it('fires onClick and has no a11y violations', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<QuestionNavItem onClick={onClick}>One</QuestionNavItem>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ActivityStructure', () => {
  it('renders stats, sections and removable tags', async () => {
    const user = userEvent.setup();
    const onRemoveTag = vi.fn();
    const onAddTag = vi.fn();
    const { container } = render(
      <ActivityStructure
        stats={[{ id: 'q', label: 'Total questions', value: '3' }]}
        sections={[{ id: 'a', heading: 'Target Audience', body: 'Adults', tags: ['Canada'] }]}
        onRemoveTag={onRemoveTag}
        onAddTag={onAddTag}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Activity Structure' })).toBeInTheDocument();
    expect(screen.getByText('Total questions')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Canada' }));
    expect(onRemoveTag).toHaveBeenCalledWith('a', 'Canada');
    await user.click(screen.getByRole('button', { name: 'Add tag' }));
    expect(onAddTag).toHaveBeenCalledWith('a');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('the summary title uses the primary colour and the card has the same 16px radius as the question cards', () => {
    const { container } = render(<ActivityStructure title="Activity Summary" stats={[]} />);
    expect(screen.getByRole('heading', { name: 'Activity Summary' })).toHaveClass('text-primary');
    expect(container.querySelector('section')).toHaveClass('rounded-xl');
    expect(container.querySelector('section')).not.toHaveClass('rounded-2xl');
  });

  it('the editor card passes dragHandleProps to the question tag', async () => {
    const user = userEvent.setup();
    const onPointerDown = vi.fn();
    const ref = vi.fn();
    render(<QuestionEditorCard active number={3} title="Hi" dragHandleProps={{ ref, role: 'button', tabIndex: 0, onPointerDown }} />);
    const handle = screen.getByRole('button', { name: 'Reorder question 3' });
    expect(handle).toHaveTextContent('Question 3');
    expect(handle).toHaveClass('cursor-grab', 'touch-none');
    await user.click(handle);
    expect(onPointerDown).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith(handle);
  });

  it('the question tag is a plain, non-focusable label without dragHandleProps', () => {
    render(<QuestionEditorCard number={3} title="Hi" />);
    expect(screen.queryByRole('button', { name: /Reorder question/ })).not.toBeInTheDocument();
    expect(screen.getByText('Question 3')).not.toHaveAttribute('tabindex');
  });

  it('can be a single-purpose widget: children render under the title, with no empty stats grid', () => {
    const { container } = render(
      <ActivityStructure title="Research Goal" stats={[]}>
        <p>Understand why people stay.</p>
      </ActivityStructure>,
    );
    expect(screen.getByRole('heading', { name: 'Research Goal' })).toHaveClass('text-heading-h3', 'text-primary');
    expect(screen.getByText('Understand why people stay.')).toBeInTheDocument();
    expect(container.querySelector('.grid')).not.toBeInTheDocument();
    expect(container.querySelector('section')).toHaveClass('rounded-xl', 'bg-surface');
  });

  it('still renders the stats grid when there are stats', () => {
    const { container } = render(<ActivityStructure stats={[{ id: 'q', label: 'Total questions', value: '3' }]} />);
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('the summary card has no border', () => {
    const { container } = render(<ActivityStructure stats={[{ id: 'q', label: 'Total questions', value: '3' }]} />);
    const card = container.querySelector('section')!;
    expect(card).toHaveClass('rounded-xl', 'bg-surface');
    expect(card.className).not.toMatch(/(^|\s)border(\s|$)/);
    expect(card.className).not.toMatch(/border-border/);
  });

  it('section body can hold block elements without invalid nesting', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ActivityStructure
        stats={[]}
        sections={[{ id: 'g', heading: 'Research Goal', body: <div data-testid="block">Editable text</div> }]}
      />,
    );
    expect(screen.getByTestId('block').parentElement?.tagName).toBe('DIV');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('StatCard shows label and value', () => {
    render(<StatCard label="Completion time" value="10 minutes" variant="warning" />);
    expect(screen.getByText('10 minutes')).toBeInTheDocument();
  });
});
