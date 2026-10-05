import { VideoCamera } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { RadioGroup } from '../Forms & Data Entry/RadioGroup';
import { FileUploadItem, FileUploadZone } from './FileUpload';
import { ImagePreview, ImageThumbnails, VideoPlayer } from './Media';
import { OpenEndAnswer } from './OpenEndAnswer';
import { QuestionCard } from './QuestionCard';
import { QuestionHeader } from './QuestionHeader';
import { QuestionOption } from './QuestionOption';
import { RankList, type RankItemData } from './RankList';
import { RatingScale } from './RatingScale';

type QuestionState = 'default' | 'answered' | 'error';

const title = 'Which of the following best describes your primary role?';
const roles = ['Product Designer / UI UX', 'Software Engineer', 'Product Manager', 'Other / General'];

function Card({ state, children }: { state: QuestionState; children: React.ReactNode }) {
  return (
    <QuestionCard>
      <QuestionHeader number={1} title={title} required={state === 'error'} error={state === 'error' ? true : undefined} />
      {children}
    </QuestionCard>
  );
}

function States({ render }: { render: (state: QuestionState) => React.ReactNode }) {
  return (
    <div className="flex items-start gap-6">
      {(['default', 'answered', 'error'] as const).map((state) => (
        <div key={state} className="flex flex-col gap-2">
          <span className="text-ui-caption text-secondary-muted-foreground capitalize">{state}</span>
          <Card state={state}>{render(state)}</Card>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Question Types/Question Cards',
  component: QuestionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The respondent-facing question types — single choice, select multiple, open end, rate, rank, document upload, video and photo — each composed from `QuestionCard`, `QuestionHeader` and the answer components. Shown in the Default, Answered and Error states. Source: Custom. Figma: Question types.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
} satisfies Meta<typeof QuestionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleChoice: Story = {
  render: () => (
    <States
      render={(state) => (
        <RadioGroup aria-label="Primary role" defaultValue={state === 'default' || state === 'answered' ? roles[0] : undefined} className="gap-4">
          {roles.map((role) => (
            <QuestionOption key={role} value={role} label={role} />
          ))}
        </RadioGroup>
      )}
    />
  ),
};

export const SelectMultiple: Story = {
  render: () => (
    <States
      render={(state) => (
        <div className="flex flex-col gap-4">
          {roles.map((role, index) => (
            <QuestionOption key={role} kind="checkbox" label={role} defaultChecked={state !== 'error' && index < 2} />
          ))}
        </div>
      )}
    />
  ),
};

export const OpenEnd: Story = {
  render: () => <States render={() => <OpenEndAnswer aria-label="Your answer" />} />,
};

export const Rate: Story = {
  render: () => (
    <States
      render={(state) => (
        <RatingScale
          aria-label="Rating"
          defaultValue={state === 'default' ? 4 : undefined}
          lowLabel="Not likely"
          highLabel="Very likely"
        />
      )}
    />
  ),
};

const rankInitial: RankItemData[] = [
  { id: 'quality', label: 'Product Quality' },
  { id: 'service', label: 'Customer Service' },
  { id: 'price', label: 'Price' },
  { id: 'brand', label: 'Brand Reputation' },
];

function Rank() {
  const [items, setItems] = React.useState(rankInitial);
  return <RankList aria-label="Rank by importance" items={items} onItemsChange={setItems} />;
}

export const RankQuestion: Story = { render: () => <States render={() => <Rank />} /> };

export const DocumentUpload: Story = {
  render: () => (
    <States
      render={(state) =>
        state === 'answered' ? (
          <FileUploadItem name="file_response.PDF" size="443KB" status="uploading" progress={44} timeLeft="2 seconds left" onRemove={() => {}} />
        ) : (
          <FileUploadZone accept=".pdf,.pptx,.docx" hint="Supported formats PDF, PPTX, or DOCX" />
        )
      }
    />
  ),
};

export const VideoQuestion: Story = {
  render: () => (
    <States
      render={(state) =>
        state === 'answered' ? (
          <VideoPlayer name="video_response.mp4" details={['443KB']} onRemove={() => {}} initialTime={84} initialDuration={225} />
        ) : (
          <FileUploadZone
            accept="video/*"
            title="Upload video"
            hint="Supported formats MP4 or MOV"
            icon={<VideoCamera size={24} aria-hidden />}
          />
        )
      }
    />
  ),
};

function PhotoAnswer() {
  const [selected, setSelected] = React.useState('1');
  const images = [
    { id: '1', alt: 'Image 1' },
    { id: '2', alt: 'Image 2' },
    { id: '3', alt: 'Image 3' },
  ];
  return (
    <div className="flex flex-col gap-4">
      <ImagePreview name="image_uploaded.png" details={['443KB', `${selected}/5`]} onRemove={() => {}} />
      <ImageThumbnails aria-label="Uploaded images" max={5} images={images} value={selected} onValueChange={setSelected} />
      <p className="text-ui-caption text-secondary-muted-foreground">3/5 images uploaded</p>
      <FileUploadItem name="image_response.png" size="1MB" status="uploading" progress={44} timeLeft="2 seconds left" onRemove={() => {}} />
    </div>
  );
}

export const PhotoQuestion: Story = {
  render: () => (
    <States
      render={(state) =>
        state === 'answered' ? (
          <PhotoAnswer />
        ) : (
          <FileUploadZone accept="image/*" title="Upload images" hint="Supported formats PNG or JPG" />
        )
      }
    />
  ),
};
