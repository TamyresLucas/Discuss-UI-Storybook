import * as React from 'react';
import { Sliders } from '@phosphor-icons/react';

import { cn } from '../../lib/utils';
import { Button } from '../Buttons & Actions/Button';
import { StatCard, type StatCardProps } from '../Data Display/StatCard';

export interface ActivityStat extends Pick<StatCardProps, 'label' | 'value' | 'icon' | 'variant'> {
  id: string;
}

export interface ActivityStructureProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  /** Stat tiles, laid out in a two-column grid. */
  stats: ActivityStat[];
  /** Called by the settings button. Omit to hide it. */
  onOpenSettings?: () => void;
  settingsLabel?: string;
}

// Figma: Activity control (361:5214) › Activity structure — summary card with stat tiles and a settings button.
export const ActivityStructure = React.forwardRef<HTMLElement, ActivityStructureProps>(
  ({ className, title = 'Activity Structure', stats, onOpenSettings, settingsLabel = 'Activity Settings', ...props }, ref) => (
    <section
      ref={ref}
      className={cn('flex w-full max-w-96.5 flex-col gap-4 rounded-2xl border border-border bg-surface px-6 py-4', className)}
      {...props}
    >
      <h3 className="text-heading-h3 text-surface-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ id, ...stat }) => (
          <StatCard key={id} {...stat} />
        ))}
      </div>
      {onOpenSettings && (
        <Button type="button" variant="outline" size="sm" className="h-9 self-start rounded-md px-4" onClick={onOpenSettings}>
          <Sliders size={16} aria-hidden />
          {settingsLabel}
        </Button>
      )}
    </section>
  ),
);
ActivityStructure.displayName = 'ActivityStructure';
