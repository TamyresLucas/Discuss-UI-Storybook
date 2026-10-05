import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { EditableTag } from './EditableTag';

describe('EditableTag', () => {
  it('calls onRemove from the labelled remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <EditableTag type="editable" onRemove={onRemove}>
        Tamyres
      </EditableTag>,
    );
    await user.click(screen.getByRole('button', { name: 'Remove Tamyres' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders the add type as a button', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <EditableTag type="add" onClick={onClick}>
        Recommendation
      </EditableTag>,
    );
    await user.click(screen.getByRole('button', { name: 'Recommendation' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the multiple type as static text without a handler', () => {
    render(<EditableTag type="multiple">+3 more</EditableTag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <EditableTag>Label</EditableTag>
        <EditableTag type="editable" onRemove={() => {}}>
          Label
        </EditableTag>
        <EditableTag type="add">Recommendation</EditableTag>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
