import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

import { RadioGroup } from '../Forms & Data Entry/RadioGroup';
import { AskAiInput, ChatInput } from './ChatInput';
import { ChatChoices, ChatOption } from './ChatChoices';
import { FileAttachment } from './FileAttachment';
import { ProjectSelector } from './ProjectSelector';

const projects = ['Customer satisfaction', 'Meal kit retention', 'Checkout flow'];

/** Project selector that keeps its own choice, so the menu can be tried out. */
function PickableProject() {
  const [project, setProject] = React.useState<string | undefined>();
  return <ProjectSelector project={project} projects={projects} onProjectChange={setProject} />;
}

const meta = {
  title: 'Conversation & AI Chat/Chat Input',
  component: ChatInput,
  subcomponents: { AskAiInput, ProjectSelector, ChatChoices, ChatOption },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Message composer: attachments + auto-growing text, an actions row with a project selector and a send button that fills when there is something to send. Also covers `AskAiInput` (the compact pill), `ProjectSelector` and `ChatChoices` / `ChatOption`. Source: Custom. Figma: Chat Input (56).',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [
    (Story) => (
      <div className="w-250">
        <Story />
      </div>
    ),
  ],
  args: { onAdd: fn(), onSubmit: fn(), trailing: <ProjectSelector selected /> },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { placeholder: 'I want to understand how [Audience] thinks about [Topic]...', trailing: <PickableProject /> },
};

export const Filled: Story = {
  args: {
    defaultValue: 'I want to understand why our subscribers stay with us instead of switching to a competing meal kit service',
    attachments: (
      <>
        <FileAttachment name="_712020a30cd77748de4da1bbf42cf9fbf1d622-Design MD Research-110826-200546 (1).pdf" type="PDF" onRemove={() => {}} />
        <FileAttachment name="_712020a30cd77748de4da1bbf42cf9fbf1d622-Design MD Research-110826-200546 (1).pdf" type="PDF" onRemove={() => {}} />
      </>
    ),
    trailing: <PickableProject />,
  },
};

export const SendsOnEnter: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Hello{enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith('Hello');
  },
};

export const WithChoices: Story = {
  args: {
    choices: (
      <ChatChoices title="Which research method would you like to use?">
        <ChatOption title="Looks right — Let’s plan my activity" description="Move on to activity planning." />
      </ChatChoices>
    ),
  },
};

function MethodChoices() {
  const [method, setMethod] = React.useState('human');
  return (
    <ChatInput
      aria-label="Message"
      choices={
        <ChatChoices title="Which research method would you like to use?">
          <RadioGroup value={method} onValueChange={setMethod} aria-label="Research method" className="gap-0">
            <ChatOption
              kind="radio"
              value="human"
              title="Human-Led Interviews"
              description="Talk to respondents directly in a meeting room built especially for qualitative research. Invite Observers and save moments as they happen."
            />
            <ChatOption kind="radio" value="ai" title="AI-Led Interviews" description="Let the AI moderator talk to respondents." />
          </RadioGroup>
        </ChatChoices>
      }
      trailing={<ProjectSelector selected />}
    />
  );
}

export const RadioChoices: Story = { render: () => <MethodChoices /> };

export const CheckboxChoices: Story = {
  args: {
    choices: (
      <ChatChoices title="Which research methods would you like to use?">
        <ChatOption kind="checkbox" title="Human-Led Interviews" description="Talk to respondents directly in a meeting room." />
      </ChatChoices>
    ),
  },
};

export const ProjectMenu: StoryObj<typeof ProjectSelector> = {
  render: () => <PickableProject />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'New Project' }));
    const menu = within(document.body);
    await expect(await menu.findByRole('menuitemradio', { name: 'New Project' })).toBeChecked();
    await userEvent.click(menu.getByRole('menuitemradio', { name: 'Meal kit retention' }));
    await expect(within(canvasElement).getByRole('button', { name: 'Meal kit retention' })).toBeInTheDocument();
  },
};

export const ProjectSelectors: StoryObj<typeof ProjectSelector> = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ProjectSelector />
      <ProjectSelector selected />
      <ProjectSelector project="Customer satisfaction" />
      <ProjectSelector project="Customer satisfaction" selected />
    </div>
  ),
};

export const Compact: StoryObj<typeof AskAiInput> = {
  decorators: [(Story) => <div className="w-84.5"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-4">
      <AskAiInput aria-label="Ask AI" />
      <AskAiInput aria-label="Ask AI (filled)" defaultValue="I want" />
    </div>
  ),
};
