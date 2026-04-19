import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, TextField } from '@mui/material';
import VirtualKeyboard from './VirtualKeyboard';
import { setCurrentInput } from 'tycho-storybook';

const meta = {
  title: 'Components/VirtualKeyboard',
  component: VirtualKeyboard,
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
  },
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' },
    defaultLayout: { control: 'text' },
    closeLabel: { control: 'text' },
  },
} satisfies Meta<typeof VirtualKeyboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [inputValue, setInputValue] = useState('');

    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <TextField
          label="Test input"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={(e) => {
            setCurrentInput(e.target, (e: any) => {
              setInputValue(e.target.value);
            });
          }}
        />

        <VirtualKeyboard
          {...args}
          onClose={() => {
            console.log('Keyboard closed');
          }}
        />
      </Box>
    );
  },
  args: {
    defaultLayout: 'default',
    closeLabel: 'Close',
  },
};
