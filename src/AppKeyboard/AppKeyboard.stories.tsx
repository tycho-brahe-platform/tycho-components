import type { Meta, StoryObj } from '@storybook/react';
import { useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import AppKeyboard from './AppKeyboard';
import CommonContext from '../configs/CommonContext';
import { corpus } from '../configs/store/actions';
import { Corpus } from '../configs/types/Corpus';

const meta = {
  title: 'Components/AppKeyboard',
  component: AppKeyboard,
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: {
        customLarge: {
          name: 'Custom Large',
          styles: {
            width: '100%',
            height: '50vh',
          },
        },
      },
      defaultViewport: 'customLarge',
    },
    docs: {
      description: {
        component:
          'Header control that toggles the on-screen virtual keyboard. The layout is taken from the `keyboardLayout` prop, otherwise from the current corpus, otherwise English.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    buttonMode: {
      control: 'select',
      options: ['filled', 'tonal', 'outlined', 'ghost'],
    },
    keyboardLayout: { control: 'text' },
  },
} satisfies Meta<typeof AppKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttonMode: 'filled',
  },
};

/** Forces a specific keyboard layout regardless of corpus (same names as `VirtualKeyboard`). */
export const WithLayoutProp: Story = {
  args: {
    buttonMode: 'filled',
    keyboardLayout: 'default',
  },
};

const mockCorpus: Corpus = {
  uid: 'story-corpus',
  name: 'Story Corpus',
  picture: '',
  uploadDir: '/uploads',
  parameters: {},
  status: 'ACTIVE',
  opened: true,
  keyboardLayout: 'english',
};

/** When `keyboardLayout` is omitted, uses `corpus.keyboardLayout`, then falls back to `english`. */
export const FromCorpus: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Corpus in context defines `keyboardLayout`. Click the icon to open the keyboard.',
      },
    },
  },
  render: (args) => {
    const { dispatch } = useContext(CommonContext);

    useEffect(() => {
      dispatch(corpus(mockCorpus));
    }, [dispatch]);

    return (
      <Box p={2}>
        <AppKeyboard {...args} />
      </Box>
    );
  },
  args: {
    buttonMode: 'outlined',
  },
};
