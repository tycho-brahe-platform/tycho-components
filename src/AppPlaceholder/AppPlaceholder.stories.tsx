import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import AppPlaceholder from './AppPlaceholder';

const meta: Meta<typeof AppPlaceholder> = {
  title: 'Components/AppPlaceholder',
  component: AppPlaceholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon name from tycho-storybook',
    },
    text: {
      control: 'text',
      description: 'Main title text displayed in the placeholder',
    },
    desc: {
      control: 'text',
      description: 'Description text displayed below the title',
    },
    children: {
      control: false,
      description: 'Custom content to render inside the placeholder',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback function triggered when placeholder is clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof AppPlaceholder>;

export const Default: Story = {
  args: {
    text: 'No items found',
  },
};

export const WithDescription: Story = {
  args: {
    icon: 'contract_delete',
    text: 'No items found',
    desc: 'Try adjusting your search or filter criteria',
  },
};

export const WithCustomIcon: Story = {
  args: {
    icon: 'file_add',
    text: 'Add new item',
    desc: 'Click to create a new entry',
  },
};

export const Clickable: Story = {
  args: {
    icon: 'file_add',
    text: 'Click to add',
    desc: 'This placeholder is clickable',
    onClick: action('placeholder-clicked'),
  },
};

export const WithCustomContent: Story = {
  args: {
    icon: 'contract_delete',
    text: 'Empty state',
    desc: 'Custom content below',
    children: (
      <div
        style={{
          padding: '1rem',
          background: '#eee',
          borderRadius: '8px',
          marginTop: '1rem',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1rem' }}>
          Custom Placeholder Content
        </h3>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
          This is inside the placeholder.
        </p>
      </div>
    ),
  },
};

export const Complete: Story = {
  args: {
    icon: 'file_add',
    text: 'Create your first item',
    desc: 'Get started by adding a new entry to your collection',
    onClick: action('placeholder-clicked'),
    children: (
      <div
        style={{
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '8px',
          marginTop: '1rem',
          textAlign: 'center',
        }}
      >
        <button
          style={{
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            action('button-clicked')();
          }}
        >
          Get Started
        </button>
      </div>
    ),
  },
};
