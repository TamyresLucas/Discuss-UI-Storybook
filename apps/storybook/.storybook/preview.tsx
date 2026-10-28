import type { Decorator, Preview } from '@storybook/react-vite'

import '@discuss-ds/ui/styles.css';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'sys.* token theme (see DESIGN_TOKENS.md dark mode mapping)',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      showName: true,
    },
  },
};

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'light';
  return (
    <div
      data-theme={theme}
      style={{
        background: 'var(--sys-color-surface-background)',
        color: 'var(--sys-color-foreground)',
        padding: 'var(--sys-space-4)',
        minHeight: '100%',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Navigation',
          [
            'Overview',
            'Org Rail (App Sidebar)',
            'Icon Button',
            'Project Sidebar',
            'Sidebar Nav Item',
            'Project Switcher',
            'Breadcrumb',
            'Tab Navigation',
            'Tab Item',
            'Collapsible',
            'Command Palette',
            'Sheet',
            'Scroll Area',
          ],
          'Buttons & Actions',
          [
            'Overview',
            'Button (Primary)',
            'Button (Secondary)',
            'Button (Icon-only)',
            'Button (Small – Reaction)',
            'Toggle (Switch)',
          ],
          'Forms & Data Entry',
          [
            'Overview',
            'Search Bar',
            'Text Input',
            'Textarea',
            'Checkbox',
            'Select (Dropdown)',
            'Label',
            'Radio Group',
            'Form',
            'Slider',
          ],
          'Data Display',
          [
            'Overview',
            'Table',
            'DataTable',
            'Table Header Row',
            'Table Row',
            'Card',
            'Session Card',
            'Sentiment Card',
            'Method Card',
            'Suggestion Card',
            'Video Player Card',
            'Progress',
            'Hover Card',
            'Skeleton',
            'Aspect Ratio',
          ],
          'Tags & Badges',
          [
            'Overview',
            'Badge',
            'Tag (Status Badge)',
            'ID Badge',
            'Count Badge',
            'Removable Tag (Chip)',
          ],
          'Identity & People',
          ['Overview', 'Avatar', 'Avatar Group', 'Org Monogram'],
          'Overlays & Feedback',
          [
            'Overview',
            'Dialog (Modal)',
            'Popover',
            'Dropdown Menu',
            'Tooltip',
            'Toast (Sonner)',
            'Alert Dialog',
          ],
          'Conversation & AI Chat',
          [
            'Overview',
            'User Message Bubble',
            'AI Response Container',
            'Chat Input',
            'AI Mini Avatar',
            'Timestamp',
          ],
          'Files & Documents',
          ['Overview', 'File List Item', 'Storage Info'],
          'Layout & Structure',
          [
            'Overview',
            'Page Header',
            'Section Header',
            'Card Container',
            'Divider (Separator)',
            'Accordion',
            'Resizable',
          ],
          'Utility',
          [
            'Overview',
            'Chevron (Expand Icon)',
            'More Menu (…)',
            'Link Action',
            'Context Menu',
            'Pagination',
            'Skeleton Line',
          ],
          'Research-Specific',
          [
            'Overview',
            'Research Plan Panel',
            'Activity Card',
            'Market & Language Table',
            'Project Tags Section',
          ],
        ],
      },
    },
  },
};

export default preview;