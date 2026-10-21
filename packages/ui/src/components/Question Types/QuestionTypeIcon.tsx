import * as React from 'react';
import { ChatsCircle, CheckSquare, FileArrowUp, FileDoc, FileImage, FileVideo, ListNumbers, RadioButton, StarHalf, VideoCamera, type IconProps } from '@phosphor-icons/react';

/**
 * `upload` is the generic file upload; `upload-video`, `upload-photo` and `upload-document` say which kind of file the respondent sends (a video file, an image, a
 * PDF/PPTX/DOCX document).
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
  'upload-video': FileVideo,
  'upload-photo': FileImage,
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
