import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { AIResponseContainer } from './AIResponseContainer';
import { AskAiToggle } from './AskAiToggle';
import { FileAttachment } from './FileAttachment';
import { Timestamp } from './Timestamp';
import { TopicActivityRow, TopicCard, TopicCardMetaItem, TopicCardTag } from './TopicCard';
import { UserMessageBubble } from './UserMessageBubble';

describe('Timestamp', () => {
  it('renders the time and groups actions in a toolbar', () => {
    render(
      <Timestamp time="5 minutes ago">
        <button type="button">Copy</button>
      </Timestamp>,
    );
    expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: 'Message actions' })).toContainElement(screen.getByRole('button', { name: 'Copy' }));
  });

  it('omits the toolbar when there are no actions', () => {
    render(<Timestamp time="now" />);
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
  });
});

describe('UserMessageBubble', () => {
  it('renders the message, attachments and footer', () => {
    render(
      <UserMessageBubble attachments={<FileAttachment name="brief.pdf" type="PDF" />} footer={<span>footer</span>}>
        Hello there
      </UserMessageBubble>,
    );
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    expect(screen.getByText('brief.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('footer')).toBeInTheDocument();
  });
});

describe('FileAttachment', () => {
  it('offers a named remove button only when removable', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { rerender } = render(<FileAttachment name="brief.pdf" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<FileAttachment name="brief.pdf" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove brief.pdf' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('AskAiToggle', () => {
  it('toggles pressed state', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<AskAiToggle type="action" onPressedChange={onPressedChange} />);

    const toggle = screen.getByRole('button', { name: 'Ask AI' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});

describe('AIResponseContainer / TopicCard', () => {
  it('renders a reply with title, content, actions and feedback', () => {
    render(
      <AIResponseContainer title="Confirm new project." actions={<div>actions</div>} feedback={<div>feedback</div>}>
        <p>Review the details.</p>
        <TopicCard
          title="Meal kit retention"
          description="Understand retention."
          tags={<TopicCardTag>Buyer Decision</TopicCardTag>}
          meta={<TopicCardMetaItem icon={<svg />}>7 Questions</TopicCardMetaItem>}
        />
      </AIResponseContainer>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Confirm new project.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Meal kit retention' })).toBeInTheDocument();
    expect(screen.getByText('Buyer Decision')).toBeInTheDocument();
    expect(screen.getByText('7 Questions')).toBeInTheDocument();
    expect(screen.getByText('actions')).toBeInTheDocument();
    expect(screen.getByText('feedback')).toBeInTheDocument();
  });

  it('activity row is a button that fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <TopicActivityRow status="New Activity Created" onClick={onClick}>
        Meal kit retention / Decision Drivers
      </TopicActivityRow>,
    );
    await user.click(screen.getByRole('button', { name: /New Activity Created/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AIResponseContainer title="Title">
        <TopicCard title="Topic" description="Description" />
      </AIResponseContainer>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
