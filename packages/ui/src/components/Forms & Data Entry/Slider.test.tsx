import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a single thumb at the default value', () => {
    render(<Slider aria-label="Volume" defaultValue={[40]} max={100} />);
    expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute('aria-valuenow', '40');
  });

  it('increases the value on ArrowRight and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={[40]} max={100} step={10} onValueChange={onValueChange} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });
    thumb.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith([50]);
  });

  it('renders one thumb per value for a range', () => {
    render(<Slider aria-label="Price range" defaultValue={[20, 80]} max={100} />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });

  it('shows the label, max and the live value bubble', async () => {
    const user = userEvent.setup();
    render(<Slider aria-label="Volume" label="Volume" defaultValue={[16]} max={40} showValue="always" />);

    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    screen.getByRole('slider', { name: 'Volume' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByText('17')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={[40]} max={100} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
