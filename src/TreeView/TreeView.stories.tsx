import type { Meta, StoryObj } from '@storybook/react';
import TreeView from './TreeView';
import {
  structWithMorphemes,
  structNotParsed,
  structWithMorphemesAndSplitters,
} from '../configs/mock/MockStructs';

const meta: Meta<typeof TreeView> = {
  title: 'Components/TreeView',
  component: TreeView,
  argTypes: {
    struct: {
      control: 'object',
    },
    expression: {
      control: 'text',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
  render: () => (
    <TreeView
      struct={structWithMorphemes}
      translations={{ 'pt-BR': '...', en: '...' }}
      renderWithInfo={true}
    />
  ),
};

export const NotParsed: Story = {
  args: {
    struct: structNotParsed,
    translations: {
      'pt-BR': 'Agora a história da mulher que virava onça.',
      en: 'Now the story of the woman who became a jaguar.',
    },
  },
};

export const Splitters: Story = {
  render: () => (
    <TreeView
      struct={structWithMorphemesAndSplitters}
      translations={{ 'pt-BR': '...', en: '...' }}
      renderWithInfo={true}
    />
  ),
};
