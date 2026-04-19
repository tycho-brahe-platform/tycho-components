import type { Meta, StoryObj } from '@storybook/react';
import LanguageSelector, {
  LanguageSelectorColors,
  LanguageSelectorSizes,
} from './LanguageSelector';

const meta: Meta<typeof LanguageSelector> = {
  title: 'Components/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: LanguageSelectorColors,
    },
    size: {
      control: 'select',
      options: LanguageSelectorSizes,
    },
    className: { control: 'text' },
    showFullLanguageLabel: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

export const Default: Story = {
  args: {
    size: 'medium',
    color: 'primary',
  },
};

export const FullLanguageLabel: Story = {
  args: {
    size: 'medium',
    color: 'primary',
    showFullLanguageLabel: true,
  },
};
