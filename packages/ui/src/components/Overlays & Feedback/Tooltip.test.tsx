import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

const renderTooltip = (content: React.ComponentProps<typeof TooltipContent>) =>
  render(
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Info</TooltipTrigger>
        <TooltipContent {...content} />
      </Tooltip>
    </TooltipProvider>,
  );

describe('Tooltip', () => {
  it('renders simple text and links it to the trigger', () => {
    renderTooltip({ children: 'Tooltip text' });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text');
    expect(screen.getByRole('button', { name: 'Info' })).toHaveAttribute('aria-describedby');
  });

  it('renders the descriptive and rich variants', () => {
    renderTooltip({ title: 'Tooltip title', description: 'More context', action: <a href="#more">Learn more</a> });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Tooltip title');
    expect(tooltip).toHaveTextContent('More context');
    expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
  });
});
