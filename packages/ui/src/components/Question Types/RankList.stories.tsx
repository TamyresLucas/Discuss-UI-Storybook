import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { RankList, type RankItemData } from './RankList';

const initial: RankItemData[] = [
  { id: 'quality', label: 'Product Quality' },
  { id: 'service', label: 'Customer Service' },
  { id: 'price', label: 'Price' },
  { id: 'brand', label: 'Brand Reputation' },
];

function Controlled() {
  const [items, setItems] = React.useState(initial);
  return <RankList aria-label="Rank by importance" items={items} onItemsChange={setItems} />;
}

const meta = {
  title: 'Question Types/Rank List',
  component: RankList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A ranking answer: rows numbered by position. Drag a row to reorder, or focus its handle and press the up / down arrow keys. Source: Custom. Figma: Rank_choice.',
      },
    },
  },
  tags: ['autodocs', 'status:review', 'source-custom'],
  decorators: [(Story) => <div className="w-108"><Story /></div>],
  args: { items: initial, onItemsChange: () => {} },
} satisfies Meta<typeof RankList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Controlled /> };
