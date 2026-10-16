import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup } from '../Forms & Data Entry/RadioGroup';
import { FileUploadItem, FileUploadZone } from './FileUpload';
import { ImagePreview, ImageThumbnails, VideoPlayer } from './Media';
import { OpenEndAnswer } from './OpenEndAnswer';
import { QuestionCard } from './QuestionCard';
import { QuestionHeader } from './QuestionHeader';
import { QuestionNavItem } from './QuestionNavItem';
import { QuestionOption, QuestionOptionEditor, QuestionOtherOption } from './QuestionOption';
import { QuestionTypeIcon } from './QuestionTypeIcon';
import { RankList } from './RankList';
import { RatingScale } from './RatingScale';
import { StimulusCard } from './StimulusCard';

describe('QuestionHeader', () => {
  it('shows the eyebrow, title and required marker', () => {
    render(<QuestionHeader number={1} title="Pick one" required />);
    expect(screen.getByText('Question 01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Pick one*');
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('shows a dismissable error banner', async () => {
    const user = userEvent.setup();
    const onDismissError = vi.fn();
    render(<QuestionHeader number={1} title="Pick one" error="Please answer." onDismissError={onDismissError} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Please answer.');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onDismissError).toHaveBeenCalledTimes(1);
  });

  it('uses the mandatory message by default', () => {
    render(<QuestionHeader number={1} title="Pick one" required error />);
    expect(screen.getByRole('alert')).toHaveTextContent('This question is mandatory.');
  });

  it('editor mode edits the title with inline edit, counting characters live', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [text, setText] = React.useState('Hi');
      return <QuestionHeader number={2} editor title={text} onTitleChange={setText} maxLength={20} actions={<button type="button">Delete</button>} />;
    };
    render(<Controlled />);
    // Read mode: the title is a button; click it to edit.
    await user.click(screen.getByRole('button', { name: /Question title/ }));
    await user.type(screen.getByRole('textbox', { name: 'Question title' }), '!!');
    expect(screen.getByText('4/20 characters')).toBeInTheDocument();
    // Enter saves the title and returns to read mode.
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Question title: Hi!!/ })).toBeInTheDocument();
    expect(screen.getByText('4/20 characters')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('editor mode keeps the title underline while active', () => {
    const { rerender } = render(<QuestionHeader number={1} editor title="Hi" />);
    expect(screen.getByRole('button', { name: /Question title/ })).toHaveClass('border-transparent');
    rerender(<QuestionHeader number={1} editor active title="Hi" />);
    expect(screen.getByRole('button', { name: /Question title/ })).toHaveClass('border-accent-muted');
  });
});

describe('showDragHandle', () => {
  it('QuestionHeader: shows the grip by default and leaves it out when the question cannot be moved', () => {
    const { container, rerender } = render(<QuestionHeader editor number={1} title="Q" />);
    expect(container.querySelector('svg')).not.toBeNull();
    rerender(<QuestionHeader editor number={1} title="Q" showDragHandle={false} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelector('.hover\\:pl-1')).toBeNull();
  });

  it('QuestionNavItem: swaps the type icon for the grip on hover by default, and keeps the icon when showDragHandle is false', () => {
    const { container, rerender } = render(<QuestionNavItem questionType="open-end">Q</QuestionNavItem>);
    expect(container.querySelectorAll('svg').length).toBe(2);
    rerender(<QuestionNavItem questionType="open-end" showDragHandle={false}>Q</QuestionNavItem>);
    expect(container.querySelectorAll('svg').length).toBe(1);
    expect(container.querySelector('.group-hover\\/nav\\:hidden')).toBeNull();
  });
});

describe('QuestionOption', () => {
  it('selects one radio option at a time and marks it accent', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Role" onValueChange={onValueChange}>
        <QuestionOption value="a" label="Designer" />
        <QuestionOption value="b" label="Engineer" />
      </RadioGroup>,
    );
    await user.click(screen.getByText('Engineer'));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('radio', { name: 'Engineer' })).toBeChecked();
  });

  it('hover changes the fill only; the border changes only when selected', () => {
    render(
      <RadioGroup aria-label="Role" defaultValue="b">
        <QuestionOption value="a" label="Designer" />
        <QuestionOption value="b" label="Engineer" />
      </RadioGroup>,
    );
    for (const name of ['Designer', 'Engineer']) {
      const row = screen.getByText(name).closest('label');
      expect(row).toHaveClass('border-border', 'hover:bg-accent-soft');
      expect(row).not.toHaveClass('hover:border-input-muted');
      expect(row).toHaveClass('has-[[data-state=checked]]:border-accent-foreground');
      expect(row).not.toHaveClass('has-[[data-state=checked]]:hover:border-accent-foreground');
    }
  });

  it('toggles checkbox options independently', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<QuestionOption kind="checkbox" label="Observers" onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByText('Observers'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('submits the "other" answer with the button or Enter', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<QuestionOtherOption aria-label="Other" onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox', { name: 'Other' }), 'Founder{enter}');
    expect(onSubmit).toHaveBeenLastCalledWith('Founder');
    await user.click(screen.getByRole('button', { name: 'Confirm answer' }));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  describe('editor row with a kind (reveals on hover)', () => {
    it('shows a placeholder while the option is empty', () => {
      render(<QuestionOptionEditor label="" placeholder="Option 1" />);
      expect(screen.getByPlaceholderText('Option 1')).toHaveValue('');
    });

    it('underlines marked words over the label while it is not edited, with a card to apply or dismiss; editing shows the plain field', async () => {
      const user = userEvent.setup();
      const onApply = vi.fn();
      const onDismiss = vi.fn();
      const { container } = render(<QuestionOptionEditor label="Recipe varity" marks={[{ start: 7, end: 13, suggestions: ['variety'] }]} onMarkApply={onApply} onMarkDismiss={onDismiss} />);
      const mark = container.querySelector('[data-mark]')!;
      expect(mark.textContent).toBe('varity');
      await user.click(mark);
      await user.click(screen.getByRole('button', { name: 'Apply' }));
      expect(onApply).toHaveBeenCalledWith({ start: 7, end: 13, suggestions: ['variety'] }, 'variety');
      await user.keyboard('{Escape}');
      await user.click(screen.getByRole('textbox', { name: 'Option label' }));
      expect(container.querySelector('[data-mark]')).not.toBeInTheDocument();
    });

    it('guards a label with minLength and maxLength: draft, helper line while editing, refusal, save, Escape', async () => {
      const user = userEvent.setup();
      const onLabelChange = vi.fn();
      render(<QuestionOptionEditor label="Price" minLength={2} maxLength={10} onLabelChange={onLabelChange} />);
      const field = screen.getByRole('textbox', { name: 'Option label' });
      expect(screen.queryByText('2 characters required')).not.toBeInTheDocument();

      await user.click(field);
      expect(screen.getByText('2 characters required')).toBeInTheDocument();
      await user.clear(field);
      await user.type(field, 'a');
      expect(onLabelChange).not.toHaveBeenCalled();

      // Too short: Enter is refused, the field stays open and says why.
      await user.keyboard('{Enter}');
      expect(onLabelChange).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 2 characters.');

      await user.type(field, 'bc');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      await user.keyboard('{Enter}');
      expect(onLabelChange).toHaveBeenCalledExactlyOnceWith('abc');
      expect(screen.queryByText('2 characters required')).not.toBeInTheDocument();
    });

    it('reverts a guarded label on Escape and never refuses an unchanged one', async () => {
      const user = userEvent.setup();
      const onLabelChange = vi.fn();
      render(<QuestionOptionEditor label="" minLength={2} maxLength={10} onLabelChange={onLabelChange} />);
      const field = screen.getByRole('textbox', { name: 'Option label' });
      await user.click(field);
      await user.keyboard('{Tab}');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(onLabelChange).not.toHaveBeenCalled();
      await user.click(field);
      await user.type(field, 'x');
      await user.keyboard('{Escape}');
      expect(field).toHaveValue('');
      expect(onLabelChange).not.toHaveBeenCalled();
    });

    it('shows the placeholder in the regular text colour when asked', () => {
      render(<QuestionOptionEditor label="" placeholder="Option 1" placeholderTone="regular" />);
      expect(screen.getByPlaceholderText('Option 1').className).toContain('placeholder:text-surface-foreground');
    });

    it('disables the trash and add buttons when removeDisabled / addDisabled are set', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const onAdd = vi.fn();
      render(<QuestionOptionEditor label="A" onRemove={onRemove} onAdd={onAdd} removeDisabled addDisabled />);
      expect(screen.getByRole('button', { name: 'Remove option' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Add option' })).toBeDisabled();
      await user.click(screen.getByRole('button', { name: 'Remove option' }));
      await user.click(screen.getByRole('button', { name: 'Add option' }));
      expect(onRemove).not.toHaveBeenCalled();
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('is quiet at rest: its normal border, an indicator instead of a visible drag handle, buttons present but transparent', () => {
      const { container } = render(<QuestionOptionEditor kind="radio" label="Recipes" />);
      // The bordered box around the grip, the input and the helper line.
      const field = container.querySelector('input')!.closest<HTMLElement>('.rounded-md')!;
      // The row border stays visible in every state and does not change on hover.
      expect(field).toHaveClass('border-border');
      expect(field).not.toHaveClass('border-transparent');
      expect(field.className).not.toMatch(/hover\/option:[^ ]*border-/);
      expect(field).toHaveClass('group-hover/option:shadow-md');
      const indicator = field.querySelector('span[aria-hidden] > span')!;
      expect(indicator).toHaveClass('rounded-full', 'size-4', 'group-hover/option:hidden');
      expect(field.querySelector('svg')).toHaveClass('hidden', 'group-hover/option:block');
      const buttons = screen.getByRole('button', { name: 'Remove option' }).parentElement!;
      expect(buttons).toHaveClass('opacity-0', 'group-hover/option:opacity-100', 'group-focus-within/option:opacity-100');
    });

    it('uses a square indicator for checkbox and a round one for radio', () => {
      const { container, rerender } = render(<QuestionOptionEditor kind="checkbox" label="A" />);
      expect(container.querySelector('span[aria-hidden] > span')).toHaveClass('rounded-xxs');
      rerender(<QuestionOptionEditor kind="radio" label="A" />);
      expect(container.querySelector('span[aria-hidden] > span')).toHaveClass('rounded-full');
    });

    it('turns the grip into a labelled drag handle when dragHandleProps is given, and lifts the row while it is dragged', () => {
      const onPointerDown = vi.fn();
      const { container, rerender } = render(<QuestionOptionEditor kind="checkbox" rank={3} label="A" dragHandleProps={{ onPointerDown }} />);
      const handle = screen.getByLabelText('Reorder option 3');
      expect(handle).toHaveClass('cursor-grab', 'touch-none');
      fireEvent.pointerDown(handle);
      expect(onPointerDown).toHaveBeenCalledTimes(1);
      expect(container.querySelector('.shadow-md')).toBeNull();
      rerender(<QuestionOptionEditor kind="checkbox" rank={3} label="A" dragHandleProps={{ onPointerDown }} lifted />);
      expect(container.querySelector('.shadow-md')).not.toBeNull();
    });

    it('locked: the label stays editable, with no grip, no add or remove buttons and the indicator kept on hover', () => {
      const { container, rerender } = render(<QuestionOptionEditor kind="checkbox" rank={2} label="A" dragHandleProps={{}} locked />);
      expect(screen.getByRole('textbox', { name: 'Option label' })).toBeEnabled();
      expect(screen.queryByLabelText(/Reorder option/)).toBeNull();
      expect(screen.queryByRole('button', { name: 'Remove option' })).toBeNull();
      expect(screen.queryByRole('button', { name: 'Add option' })).toBeNull();
      expect(container.querySelector('svg')).toBeNull();
      rerender(<QuestionOptionEditor kind="rank" rank={2} label="A" locked />);
      expect(container.querySelector('svg')).toBeNull();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('keeps the grip decorative without dragHandleProps', () => {
      render(<QuestionOptionEditor kind="radio" label="A" />);
      expect(screen.queryByLabelText(/Reorder option/)).toBeNull();
    });

    it('rank kind keeps the drag handle and shows the position number at rest, and still reveals the editor on hover', () => {
      render(<QuestionOptionEditor kind="rank" rank={2} label="Price" />);
      const field = screen.getByRole('textbox', { name: 'Option label' }).closest<HTMLElement>('.rounded-md')!;
      expect(field).toHaveClass('group-hover/option:shadow-md', 'group-focus-within/option:shadow-md');
      const handle = field.querySelector('svg')!;
      expect(handle).not.toHaveClass('hidden');
      expect(field.querySelector('span[aria-hidden]')).toHaveTextContent('2');
      expect(field.querySelector('span[aria-hidden]')).toHaveClass('rounded-full');
      const buttons = screen.getByRole('button', { name: 'Remove option' }).parentElement!;
      expect(buttons).toHaveClass('opacity-0', 'group-hover/option:opacity-100');
    });

    it('keeps the same width at rest and on hover: the buttons keep their space', () => {
      const { container } = render(<QuestionOptionEditor kind="radio" label="A" />);
      const buttons = screen.getByRole('button', { name: 'Remove option' }).parentElement!;
      // Hidden with opacity, never display:none or hidden, so they still occupy their column.
      expect(buttons).not.toHaveClass('hidden');
      expect(container.firstElementChild).toHaveClass('flex', 'w-full');
    });

    it('buttons stay keyboard-reachable and work', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      const onAdd = vi.fn();
      render(<QuestionOptionEditor kind="checkbox" label="A" onRemove={onRemove} onAdd={onAdd} />);
      await user.tab(); // the label field
      await user.tab(); // remove
      expect(screen.getByRole('button', { name: 'Remove option' })).toHaveFocus();
      await user.keyboard('{Enter}');
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('without a kind the row is the unchanged always-on editor', () => {
      const { container } = render(<QuestionOptionEditor label="A" />);
      // The bordered box around the grip, the input and the helper line.
      const field = container.querySelector('input')!.closest<HTMLElement>('.rounded-md')!;
      expect(field).toHaveClass('border-border', 'hover:border-input-muted');
      expect(field).not.toHaveClass('border-transparent');
      expect(screen.getByRole('button', { name: 'Remove option' }).parentElement).not.toHaveClass('opacity-0');
    });
  });

  it('editor row edits, removes and adds', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onAdd = vi.fn();
    render(<QuestionOptionEditor label="Radio option" onRemove={onRemove} onAdd={onAdd} />);
    await user.click(screen.getByRole('button', { name: 'Remove option' }));
    await user.click(screen.getByRole('button', { name: 'Add option' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});

describe('RatingScale', () => {
  it('selects a rating and reports it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RatingScale aria-label="Rating" onValueChange={onValueChange} lowLabel="Low" highLabel="High" />);
    await user.click(screen.getByRole('radio', { name: '4' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('radio', { name: '4' })).toBeChecked();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });
});

describe('OpenEndAnswer', () => {
  it('counts characters up to the limit', async () => {
    const user = userEvent.setup();
    render(<OpenEndAnswer aria-label="Answer" maxLength={10} />);
    expect(screen.getByText('0/10 characters')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Answer' }), 'hello');
    expect(screen.getByText('5/10 characters')).toBeInTheDocument();
  });
});

describe('RankList', () => {
  const items = [
    { id: 'a', label: 'Quality' },
    { id: 'b', label: 'Service' },
    { id: 'c', label: 'Price' },
  ];

  it('numbers the rows by position', () => {
    render(<RankList items={items} onItemsChange={() => {}} />);
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['1Quality', '2Service', '3Price']);
  });

  it('moves a row with the arrow keys and announces it', async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<RankList items={items} onItemsChange={onItemsChange} />);

    screen.getAllByRole('button', { name: /Reorder, position 1 of 3/ })[0]!.focus();
    await user.keyboard('{ArrowDown}');

    expect(onItemsChange).toHaveBeenCalledWith([items[1], items[0], items[2]]);
    expect(screen.getByRole('status')).toHaveTextContent('Moved to position 2 of 3');
  });

  it('does nothing when moving past the ends', async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<RankList items={items} onItemsChange={onItemsChange} />);
    screen.getAllByRole('button', { name: /Reorder, position 1 of 3/ })[0]!.focus();
    await user.keyboard('{ArrowUp}');
    expect(onItemsChange).not.toHaveBeenCalled();
  });

  it('reorders by drag and drop', () => {
    const onItemsChange = vi.fn();
    render(<RankList items={items} onItemsChange={onItemsChange} />);
    const rows = screen.getAllByRole('listitem');
    fireEvent.dragStart(rows[0]!);
    fireEvent.dragOver(rows[2]!);
    fireEvent.drop(rows[2]!);
    expect(onItemsChange).toHaveBeenCalledWith([items[1], items[2], items[0]]);
  });
});

describe('FileUpload', () => {
  it('reports files chosen with the input', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    render(<FileUploadZone hint="PDF only" onFiles={onFiles} data-testid="input" />);
    const file = new File(['x'], 'brief.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByTestId('input'), file);
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByText('PDF only')).toBeInTheDocument();
  });

  it('shows progress while uploading and a status tag afterwards', () => {
    const { rerender } = render(<FileUploadItem name="a.pdf" size="1KB" status="uploading" progress={44} timeLeft="2 seconds left" />);
    expect(screen.getByRole('progressbar', { name: 'Uploading a.pdf' })).toHaveAttribute('aria-valuenow', '44');
    expect(screen.getByText('44%')).toBeInTheDocument();
    expect(screen.getByText(/2 seconds left/)).toBeInTheDocument();

    rerender(<FileUploadItem name="a.pdf" status="complete" />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();

    rerender(<FileUploadItem name="a.pdf" status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('shows the status tag beside the file size, not beside the name', () => {
    render(<FileUploadItem name="photo.jpeg" size="3.0MB" status="complete" />);
    const tag = screen.getByText('Complete');
    expect(tag.parentElement).toHaveTextContent('3.0MB');
    expect(tag.parentElement).not.toContainElement(screen.getByText('photo.jpeg'));
  });

  it('removes a file', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FileUploadItem name="a.pdf" status="complete" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('Media', () => {
  it('image preview shows name, details and a remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ImagePreview name="photo.png" details={['443KB', '1/5']} onRemove={onRemove} />);
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.getByText(/443KB/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove photo.png' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('thumbnails select one image and leave empty slots inert', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ImageThumbnails
        aria-label="Images"
        max={5}
        images={[
          { id: '1', alt: 'Image 1' },
          { id: '2', alt: 'Image 2' },
        ]}
        value="1"
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    await user.click(screen.getByRole('radio', { name: 'Image 2' }));
    expect(onValueChange).toHaveBeenCalledWith('2');
  });

  it('video player shows the time, toggles play and mutes', async () => {
    const user = userEvent.setup();
    render(<VideoPlayer name="clip.mp4" details={['443KB']} initialTime={84} initialDuration={225} />);
    expect(screen.getByText('1:24 / 3:45')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Seek' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Play' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(screen.getByRole('button', { name: 'Unmute' })).toBeInTheDocument();
  });
});

describe('QuestionCard / QuestionTypeIcon', () => {
  it('renders a card with a header and answers, with no accessibility violations', async () => {
    const { container } = render(
      <QuestionCard>
        <QuestionHeader number={1} title="Pick one" />
        <RadioGroup aria-label="Pick one">
          <QuestionOption value="a" label="A" />
        </RadioGroup>
        <QuestionTypeIcon type="ranking" />
      </QuestionCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('QuestionTypeIcon', () => {
  it.each(['select-one', 'select-multiple', 'ranking', 'upload', 'rating', 'open-end', 'screen-recording'] as const)(
    'renders a decorative icon for %s',
    (type) => {
      const { container } = render(<QuestionTypeIcon type={type} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    },
  );
});

describe('ImagePreview height', () => {
  it('hugs an image (no fixed height, capped at 336px) and keeps the fixed height for the empty placeholder', () => {
    const { container, rerender } = render(<ImagePreview name="photo.png" />);
    expect(container.querySelector('.bg-accent-soft')).toHaveClass('h-84');
    rerender(
      <ImagePreview name="photo.png">
        <img alt="" src="data:image/png;base64,AAAA" />
      </ImagePreview>,
    );
    const area = container.querySelector('.bg-accent-soft')!;
    expect(area).not.toHaveClass('h-84');
    expect(area).toHaveClass('[&>img]:h-auto', '[&>img]:max-h-84', '[&>img]:w-full');
  });
});

describe('StimulusCard', () => {
  it('shows the label, the caption and the thumbnail', () => {
    const { container } = render(<StimulusCard thumbnail="data:image/png;base64,AAAA" thumbnailAlt="Meal kit" caption="Look at this image" />);
    expect(screen.getByText('AI Moderator')).toBeInTheDocument();
    expect(screen.getByText('Look at this image')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Meal kit' })).toHaveClass('object-cover', 'absolute', 'inset-0');
    expect(container.firstElementChild).toHaveAttribute('data-status', 'default');
  });

  it('falls back to a placeholder icon without a thumbnail, and takes a custom icon', () => {
    const { container, rerender } = render(<StimulusCard caption="x" />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeInTheDocument();
    rerender(<StimulusCard caption="x" icon={<span data-testid="custom">v</span>} />);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
  });

  it('shows the error state when asked, and when the thumbnail fails to load', () => {
    const { container, rerender } = render(<StimulusCard caption="x" status="error" thumbnail="a.png" />);
    expect(container.firstElementChild).toHaveAttribute('data-status', 'error');
    expect(container.querySelector('img')).toBeNull();
    rerender(<StimulusCard caption="x" thumbnail="b.png" />);
    expect(container.firstElementChild).toHaveAttribute('data-status', 'default');
    fireEvent.error(container.querySelector('img')!);
    expect(container.firstElementChild).toHaveAttribute('data-status', 'error');
    expect(container.querySelector('img')).toBeNull();
    rerender(<StimulusCard caption="x" thumbnail="c.png" />);
    expect(container.firstElementChild).toHaveAttribute('data-status', 'default');
  });

  it('edits the caption in place when onCaptionChange is given', async () => {
    const user = userEvent.setup();
    const onCaptionChange = vi.fn();
    render(<StimulusCard caption="Look" onCaptionChange={onCaptionChange} />);
    await user.click(screen.getByRole('button', { name: /Stimulus caption/ }));
    const field = screen.getByRole('textbox', { name: /Stimulus caption/ });
    await user.clear(field);
    await user.type(field, 'Watch this{Enter}');
    expect(onCaptionChange).toHaveBeenCalledWith('Watch this');
  });

  it('lets the editable caption fill the width of the card (its column does not align items to the start)', () => {
    render(<StimulusCard caption="Look" onCaptionChange={() => {}} />);
    const editor = screen.getByRole('button', { name: /Stimulus caption/ }).parentElement!;
    expect(editor).toHaveClass('w-auto');
    expect(editor.parentElement).not.toHaveClass('items-start');
  });

  it('cancels the caption editor padding so the card height hugs its content', () => {
    render(<StimulusCard caption="Look" onCaptionChange={() => {}} />);
    const editor = screen.getByRole('button', { name: /Stimulus caption/ }).parentElement!;
    expect(editor).toHaveClass('-mt-1', '-mb-1.5');
  });

  it('is responsive: a minimum height, and a square thumbnail sized from the text (92-240px)', () => {
    const { container } = render(<StimulusCard caption="x" />);
    expect(container.firstElementChild).toHaveClass('min-h-24.5');
    expect(container.querySelector('span')).toHaveStyle({ width: '92px', height: '92px' });
  });

  it('grows the thumbnail with the measured text height and caps it at 240px', async () => {
    const callbacks: Array<() => void> = [];
    class FakeResizeObserver {
      constructor(callback: () => void) {
        callbacks.push(callback);
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', FakeResizeObserver);
    try {
      const { container } = render(<StimulusCard caption="x" onCaptionChange={() => {}} />);
      const column = screen.getByRole('button', { name: /Stimulus caption/ }).parentElement!.parentElement!;
      const thumb = container.querySelector('span')!;
      const heightOf = (height: number) => vi.spyOn(column, 'getBoundingClientRect').mockReturnValue({ height } as DOMRect);
      const fire = () => act(() => callbacks.forEach((callback) => callback()));
      heightOf(68);
      fire();
      expect(thumb).toHaveStyle({ width: '92px', height: '92px' });
      heightOf(120);
      fire();
      expect(thumb).toHaveStyle({ width: '120px', height: '120px' });
      heightOf(500);
      fire();
      expect(thumb).toHaveStyle({ width: '240px', height: '240px' });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('shows a live "n/max characters" counter for an editable caption, and can hide it', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<StimulusCard caption="Look" onCaptionChange={() => {}} maxLength={2000} />);
    expect(screen.getByText('4/2000 characters')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Stimulus caption/ }));
    await user.type(screen.getByRole('textbox', { name: /Stimulus caption/ }), '!!');
    expect(screen.getByText('6/2000 characters')).toBeInTheDocument();
    rerender(<StimulusCard caption="Look" onCaptionChange={() => {}} maxLength={2000} showCounter={false} />);
    expect(screen.queryByText(/characters/)).not.toBeInTheDocument();
    rerender(<StimulusCard caption="Look" maxLength={2000} />);
    expect(screen.queryByText(/characters/)).not.toBeInTheDocument();
  });

  it('removes with a labelled button, and hides it without onRemove', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { rerender } = render(<StimulusCard caption="x" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove stimulus' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    rerender(<StimulusCard caption="x" />);
    expect(screen.queryByRole('button', { name: 'Remove stimulus' })).not.toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<StimulusCard thumbnail="data:image/png;base64,AAAA" thumbnailAlt="Meal kit" caption="Look at this image" onRemove={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
