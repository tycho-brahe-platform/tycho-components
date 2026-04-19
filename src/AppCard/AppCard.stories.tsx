import type { Meta, StoryObj } from '@storybook/react';
import AppCard from './AppCard';
import './style.scss';

const meta: Meta<typeof AppCard> = {
  title: 'Components/AppCard',
  component: AppCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    children: { control: 'text' },
    footer: { control: 'text' },
    options: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof AppCard>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'This is the card body content. You can add any React components here.',
    footer: 'Card Footer',
  },
};

export const WithReactNodeTitle: Story = {
  args: {
    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>📋</span>
        <span>Card with Icon</span>
      </div>
    ),
    children: 'This card demonstrates using a React node as the title.',
    footer: 'Footer content',
  },
};

export const RichContent: Story = {
  args: {
    title: 'User Profile',
    children: (
      <div>
        <h5>John Doe</h5>
        <p>Email: john.doe@example.com</p>
        <p>Role: Administrator</p>
      </div>
    ),
    footer: (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary">Save</button>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: 'Article Card',
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    ),
    footer: 'Last updated: January 24, 2026',
  },
};

export const WithOptions: Story = {
  args: {
    title: 'Card with Options',
    children: 'This card demonstrates the dropdown menu with multiple options.',
    footer: 'Card with action menu',
    options: [
      {
        label: 'Dividir morfema',
        icon: 'call_split',
        onClick: () => console.log('call_split'),
      },
      {
        label: 'Excluir',
        icon: 'delete',
        className: 'danger',
        onClick: () => console.log('delete'),
      },
    ],
  },
};

export const WithFilterInput: Story = {
  args: {
    title: 'Card with Filter',
    children: (
      <div>
        <p>This card demonstrates using an input filter in the header actions.</p>
        <p>You can search or filter content displayed in this card.</p>
      </div>
    ),
    footer: 'Results: 0 items found',
    extraHeaderActions: (
      <input
        type="text"
        className="input-filter"
        placeholder="Search..."
      />
    ),
  },
};
