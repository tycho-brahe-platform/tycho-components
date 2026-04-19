import type { Meta, StoryObj } from '@storybook/react';
import AppClipboard from './AppClipboard';

const meta = {
  title: 'Components/AppClipboard',
  component: AppClipboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    size: {
      control: 'select',
      options: ['x-small', 'small', 'medium', 'large'],
    },
  },
} satisfies Meta<typeof AppClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Text to copy to clipboard',
    size: 'x-small',
  },
};

export const Small: Story = {
  args: {
    text: 'Small copy button',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    text: 'Medium copy button',
    size: 'medium',
  },
};
