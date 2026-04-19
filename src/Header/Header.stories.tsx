import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { HelpAction } from './HelpButton/HelpButton';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story: ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    tool: { control: 'text' },
    hideKeyboard: { control: 'boolean' },
    keyboardLayout: { control: 'text' },
    helpActions: { control: 'object' },
    customHeader: {
      control: false,
      description:
        'Optional center slot for host-specific controls (toolbar, status, etc.).',
    },
    navigateHome: {
      action: 'navigateHome',
      description:
        'When set, the platform title becomes clickable and calls this handler.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Header>;

const mockHelpActions: HelpAction[] = [
  {
    title: 'Syntactic Analysis',
    desc: 'Open syntactic analysis tutorial',
    action: () => {
      alert('Syntactic analysis');
    },
  },
  {
    title: 'Morphological Analysis',
    desc: 'Open morphological analysis tutorial',
    action: () => {
      alert('Morphological analysis');
    },
  },
  {
    title: 'Lexicon',
    desc: 'Open lexicon tutorial',
    action: () => {
      alert('Lexicon');
    },
  },
];

export const Default: Story = {
  args: {
    tool: 'Admin',
    helpActions: [
      {
        title: 'Syntactic',
        desc: 'Open syntactic analysis',
        action: () => {
          alert('syntactic');
        },
      },
      {
        title: 'Syntactic',
        desc: 'Open syntactic analysis',
        action: () => {
          alert('syntactic');
        },
      },
      {
        title: 'Syntactic',
        desc: 'Open syntactic analysis',
        action: () => {
          alert('syntactic');
        },
      },
      {
        title: 'Syntactic',
        desc: 'Open syntactic analysis',
        action: () => {
          alert('syntactic');
        },
      },
    ],
  },
};

export const WithAllFeatures: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard layout, optional home navigation, and help actions. Use the keyboard icon to open the virtual keyboard.',
      },
    },
  },
  args: {
    tool: 'Interoperabilidade',
    keyboardLayout: 'english',
    navigateHome: () => {
      console.log('Navigate home');
    },
    helpActions: mockHelpActions,
  },
};

export const WithCustomHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The center region can render host content such as breadcrumbs or a compact toolbar.',
      },
    },
  },
  args: {
    tool: 'Admin',
    helpActions: mockHelpActions,
    customHeader: (
      <span style={{ opacity: 0.85, fontSize: 14 }}>Custom center content</span>
    ),
  },
};

export const HideKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Hides the virtual keyboard trigger when the host provides input elsewhere.',
      },
    },
  },
  args: {
    tool: 'Admin',
    hideKeyboard: true,
    helpActions: mockHelpActions,
  },
};
