import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AppDropzone from './AppDropzone';

const defaultAccept: Record<string, string[]> = {
  'text/plain': ['.txt', '.csv'],
  'application/json': ['.json'],
};

const meta = {
  title: 'Components/AppDropzone',
  component: AppDropzone,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: () => {},
    onSuccess: () => {},
    accept: defaultAccept,
  },
  argTypes: {
    title: { control: 'text' },
    accept: { control: 'object' },
    onClose: { control: false },
    onSuccess: { control: false },
    onError: { control: false },
    onDrop: { control: false },
    alternativeButton: { control: false },
  },
} satisfies Meta<typeof AppDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

function DropzoneStory(props: {
  title?: string;
  accept?: Record<string, string[]>;
  alternativeButton?: { title: string; action: () => void };
}) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div style={{ padding: 24 }}>
        <button type="button" onClick={() => setOpen(true)}>
          Open dropzone
        </button>
      </div>
    );
  }

  return (
    <AppDropzone
      title={props.title}
      accept={props.accept ?? defaultAccept}
      onClose={() => setOpen(false)}
      onSuccess={(files) => {
        alert(
          `Uploaded ${files.length} file(s): ${files.map((f) => f.name).join(', ')}`
        );
        setOpen(false);
      }}
      onError={(err) => {
        alert(`Error: ${String(err)}`);
      }}
      alternativeButton={props.alternativeButton}
    />
  );
}

export const Default: Story = {
  render: (args) => (
    <DropzoneStory title={args.title} accept={args.accept} />
  ),
};

export const CustomTitle: Story = {
  render: (args) => (
    <DropzoneStory title={args.title ?? 'Import documents'} accept={args.accept} />
  ),
  args: {
    title: 'Import documents',
  },
};

export const WithAlternativeButton: Story = {
  render: (args) => (
    <DropzoneStory
      title={args.title}
      accept={args.accept}
      alternativeButton={{
        title: 'Skip upload',
        action: () => alert('Alternative action'),
      }}
    />
  ),
};
