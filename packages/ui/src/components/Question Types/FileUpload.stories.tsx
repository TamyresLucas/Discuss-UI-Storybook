import { VideoCamera } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { FileUploadItem, FileUploadZone } from './FileUpload';

const meta = {
  title: 'Question Types/File Upload',
  component: FileUploadItem,
  subcomponents: { FileUploadZone },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dashed upload zone (click or drop) and the file rows it produces: uploading with progress, complete, or error. Source: Custom. Figma: File upload.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-107.5"><Story /></div>],
  args: { name: 'video_response.mp4', size: '443KB', onRemove: () => {}, icon: <VideoCamera size={24} aria-hidden /> },
} satisfies Meta<typeof FileUploadItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploading: Story = { args: { status: 'uploading', progress: 44, timeLeft: '2 seconds left' } };
export const Complete: Story = { args: { status: 'complete' } };
export const Error: Story = { args: { status: 'error' } };

function Zone() {
  const [files, setFiles] = React.useState<File[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <FileUploadZone
        accept=".pdf,.pptx,.docx"
        hint="Supported formats PDF, PPTX, or DOCX"
        onFiles={(next) => setFiles(next)}
      />
      {files.map((file) => (
        <FileUploadItem key={file.name} name={file.name} size={`${Math.round(file.size / 1024)}KB`} status="complete" />
      ))}
    </div>
  );
}

export const UploadZone: StoryObj<typeof FileUploadZone> = { render: () => <Zone /> };
