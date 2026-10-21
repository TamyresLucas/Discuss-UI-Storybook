import * as React from 'react';
import { ChatsCircle, CheckSquare, FileArrowUp, FileDoc, Image, ListNumbers, RadioButton, StarHalf, Video, VideoCamera, type IconProps } from '@phosphor-icons/react';

/**
 * `upload` is the generic file upload; `upload-video`, `upload-photo` and `upload-document` say which kind of file the respondent sends (a video icon, an image icon, a document
 * file icon for PDF/PPTX/DOCX). The video icon is not the camera that marks a screen recording.
 */
export type QuestionType =
  | 'select-one'
  | 'select-multiple'
  | 'ranking'
  | 'upload'
  | 'upload-video'
  | 'upload-photo'
  | 'upload-document'
  | 'rating'
  | 'open-end'
  | 'screen-recording';

const icons: Record<QuestionType, React.ComponentType<IconProps>> = {
  'select-one': RadioButton,
  'select-multiple': CheckSquare,
  ranking: ListNumbers,
  upload: FileArrowUp,
  'upload-video': Video,
  'upload-photo': Image,
  'upload-document': FileDoc,
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
