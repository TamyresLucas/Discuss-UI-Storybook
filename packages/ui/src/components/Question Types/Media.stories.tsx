import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { ImagePreview, ImageThumbnails, VideoPlayer } from './Media';

const meta = {
  title: 'Question Types/Media',
  component: VideoPlayer,
  subcomponents: { ImagePreview, ImageThumbnails },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Previews for video and photo answers: `VideoPlayer` (play, seek, time, volume, full screen), `ImagePreview` and selectable `ImageThumbnails`. Source: Custom. Figma: File upload.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-107.5"><Story /></div>],
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Video: Story = {
  args: { name: 'video_response.mp4', details: ['443KB'], onRemove: () => {}, initialTime: 84, initialDuration: 225 },
};

function Photos() {
  const [selected, setSelected] = React.useState('1');
  const images = [
    { id: '1', alt: 'Image 1' },
    { id: '2', alt: 'Image 2' },
    { id: '3', alt: 'Image 3' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <ImagePreview name="image_uploaded.png" details={['443KB', `${selected}/5`]} onRemove={() => {}} />
      <div className="flex flex-col gap-2">
        <ImageThumbnails aria-label="Uploaded images" max={5} images={images} value={selected} onValueChange={setSelected} />
        <p className="text-ui-caption text-secondary-muted-foreground">3/5 images uploaded</p>
      </div>
    </div>
  );
}

export const Photo: StoryObj<typeof ImagePreview> = { render: () => <Photos /> };

// A 16x10 PNG, so the story works offline: the preview area takes the image's own proportions.
const wideImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAIAAAAy3EnLAAAAFElEQVR4nGPodblJEmIY1TA0NQAAsIwKUAgH120AAAAASUVORK5CYII=';

/** With an image, the preview area hugs it: full width, its own height (up to 336px). The empty one above keeps the fixed height. */
export const PhotoHugsImage: StoryObj<typeof ImagePreview> = {
  render: () => (
    <div className="w-107.5">
      <ImagePreview name="wide_photo.png" details={['10KB']} onRemove={() => {}}>
        <img alt="A wide sample" src={wideImage} />
      </ImagePreview>
    </div>
  ),
};
