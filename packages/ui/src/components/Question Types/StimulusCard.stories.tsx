import { VideoCamera } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { StimulusCard } from './StimulusCard';

// A 1x1 PNG so the "with image" story works offline; the thumbnail crops any image to fill.
const sampleImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const meta = {
  title: 'Question Types/Stimulus Card',
  component: StimulusCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The image or video attached to a question, as it appears in the question card: an 80px thumbnail, the "AI Moderator" label over what the moderator says about it (the caption), and a trash button. Pass `onCaptionChange` to make the caption editable in place; `status="error"` (or a thumbnail that fails to load) shows the broken-image state. Source: Custom. Figma: Stimulus card.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  argTypes: {
    status: { control: 'radio', options: ['default', 'error'] },
  },
  decorators: [
    (Story) => (
      <div className="w-100">
        <Story />
      </div>
    ),
  ],
  args: { caption: 'Look at this image', onRemove: () => {} },
} satisfies Meta<typeof StimulusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No thumbnail yet: the image icon on a neutral fill. */
export const Default: Story = {};

export const WithImage: Story = { args: { thumbnail: sampleImage, thumbnailAlt: 'Meal kit box' } };

/** For a video, pass its own icon (or a frame as `thumbnail`). */
export const Video: Story = { args: { icon: <VideoCamera size={24} aria-hidden />, caption: 'Watch this video' } };

/** The stimulus could not be loaded: broken-image icon on the destructive soft fill. */
export const ErrorState: Story = { args: { status: 'error' } };

function Editable() {
  const [caption, setCaption] = React.useState('Look at this image');
  return <StimulusCard caption={caption} onCaptionChange={setCaption} onRemove={() => {}} />;
}

/** `onCaptionChange` turns the caption into an inline editor: click it, type, Enter saves. */
export const EditableCaption: Story = { render: () => <Editable /> };

export const ReadOnly: Story = { args: { onRemove: undefined } };
