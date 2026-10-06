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

  it('StatCard shows label and value', () => {
    render(<StatCard label="Completion time" value="10 minutes" variant="warning" />);
    expect(screen.getByText('10 minutes')).toBeInTheDocument();
  });
});
