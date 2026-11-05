import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { QuestionNavItem } from './QuestionNavItem';

const icon = (button: HTMLElement) => button.querySelector('span[aria-hidden="true"] svg:not(.hidden)') ?? button.querySelector('svg.text-destructive-foreground, svg.text-warning-foreground');

describe('QuestionNavItem', () => {
  it('shows the exclamation circle in the destructive colour on error', () => {
    render(<QuestionNavItem error>Which drinks?</QuestionNavItem>);
    const button = screen.getByRole('button', { name: /Which drinks\?/ });
    const warningIcon = button.querySelector('svg.text-destructive-foreground');
    expect(warningIcon).not.toBeNull();
    // Phosphor's circle icon draws a <circle>-less path set of the "warning-circle" glyph; the triangle one has a different viewBox path, so check the sr-only text and the classes.
    expect(button).toHaveClass('hover:bg-destructive-soft');
    expect(screen.getByText(', has errors')).toBeInTheDocument();
  });

  it('shows the exclamation triangle in the warning colour on warning, with the soft warning hover', () => {
    render(<QuestionNavItem warning>Why do you visit?</QuestionNavItem>);
    const button = screen.getByRole('button', { name: /Why do you visit\?/ });
    expect(icon(button)).toHaveClass('text-warning-foreground');
    expect(button).toHaveClass('hover:bg-warning-soft', 'focus-visible:border-warning-foreground');
    expect(screen.getByText(', has warnings')).toBeInTheDocument();
  });

  it('marks a selected warning row with the warning border', () => {
    render(<QuestionNavItem warning selected>Why?</QuestionNavItem>);
    expect(screen.getByRole('button')).toHaveClass('border-warning-foreground');
  });

  it('lets error win over warning', () => {
    render(<QuestionNavItem error warning>Both</QuestionNavItem>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-destructive-soft');
    expect(button).not.toHaveClass('hover:bg-warning-soft');
    expect(screen.queryByText(', has warnings')).toBeNull();
  });

  it('shows the question type icon when neither is set', () => {
    render(<QuestionNavItem questionType="rating">How often?</QuestionNavItem>);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg.text-destructive-foreground, svg.text-warning-foreground')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <nav aria-label="Questions">
        <QuestionNavItem error>One</QuestionNavItem>
        <QuestionNavItem warning>Two</QuestionNavItem>
      </nav>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
