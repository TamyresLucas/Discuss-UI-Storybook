import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { StatusTag, Tag } from './Tag';

describe('Tag', () => {
  it('renders its label', () => {
    render(<Tag variant="success">Live Interview</Tag>);
    expect(screen.getByText('Live Interview')).toBeInTheDocument();
  });

  it('maps variants to soft token classes', () => {
    render(<Tag variant="destructive">Failed</Tag>);
    expect(screen.getByText('Failed')).toHaveClass('bg-destructive-soft', 'border-destructive-soft-border');
  });

  it('hides the status dot from assistive tech', () => {
    render(<StatusTag status="pending">Pending</StatusTag>);
    const tag = screen.getByText('Pending');
    expect(tag.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(tag.firstElementChild).toHaveClass('bg-warning');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Tag>Label</Tag>
        <StatusTag status="active">Active</StatusTag>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
