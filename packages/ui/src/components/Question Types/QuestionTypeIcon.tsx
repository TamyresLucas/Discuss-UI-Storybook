import * as React from 'react';
import { ChatsCircle, CheckSquare, FileArrowUp, ListNumbers, RadioButton, StarHalf, VideoCamera, type IconProps } from '@phosphor-icons/react';

export type QuestionType = 'select-one' | 'select-multiple' | 'ranking' | 'upload' | 'rating' | 'open-end' | 'screen-recording';

const icons: Record<QuestionType, React.ComponentType<IconProps>> = {
  'select-one': RadioButton,
  'select-multiple': CheckSquare,
  ranking: ListNumbers,
  upload: FileArrowUp,
  rating: StarHalf,
  'open-end': ChatsCircle,
  'screen-recording': VideoCamera,
};

export interface QuestionTypeIconProps extends Omit<IconProps, 'weight'> {
  type: QuestionType;
}

// Figma: Question types › Question type icons — duotone glyphs in the accent colour (22.5px).
export function QuestionTypeIcon({ type, size = 22.5, className, ...props }: QuestionTypeIconProps) {
  const Icon = icons[type];
  return <Icon size={size} weight="duotone" aria-hidden className={className ?? 'text-accent-foreground'} {...props} />;
}
