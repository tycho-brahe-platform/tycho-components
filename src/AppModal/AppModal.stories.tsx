import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AppModal from './AppModal';
import AppModalConfirm from './AppModalConfirm';
import './style.scss';

const meta: Meta<typeof AppModal> = {
  title: 'Components/AppModal',
  component: AppModal,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    className: { control: 'text' },
    disableConfirm: { control: 'boolean' },
    hideFooter: { control: 'boolean' },
    disableCancel: { control: 'boolean' },
    disableClose: { control: 'boolean' },
    disableEscapeClose: { control: 'boolean' },
    disableBackdropClose: { control: 'boolean' },
    confirmLabel: { control: 'text' },
    closeLabel: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof AppModal>;

export const Primary: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
      setOpen(false);
      alert('Modal closed');
    };

    const handleConfirm = () => {
      alert('Confirmed!');
    };

    return (
      open && (
        <AppModal {...args} close={handleClose} confirm={handleConfirm}>
          <p>This is the modal body content.</p>
        </AppModal>
      )
    );
  },
  args: {
    title: 'Confirm Action',
    subtitle: 'Are you sure you want to proceed?',
    confirmLabel: 'Yes, continue',
    closeLabel: 'Cancel',
    disableConfirm: false,
    hideFooter: false,
    disableCancel: false,
    disableClose: false,
    disableEscapeClose: false,
    alternativeButton: {
      title: 'Alternative',
      action: () => alert('alternative'),
    },
  },
};

export const DisableBackdropClose: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
      setOpen(false);
      alert('Modal closed');
    };

    return (
      open && (
        <AppModal {...args} close={handleClose} confirm={() => alert('Confirmed!')}>
          <p>
            Clicking the dimmed area outside this dialog should <strong>not</strong> close it.
            Use Cancel, the header close icon, or Escape to dismiss and trigger the close alert.
          </p>
        </AppModal>
      )
    );
  },
  args: {
    title: 'Backdrop close disabled',
    subtitle: 'Outside clicks are ignored',
    disableBackdropClose: true,
    closeLabel: 'Cancel',
    confirmLabel: 'Confirm',
    disableConfirm: false,
    hideFooter: false,
    disableCancel: false,
    disableClose: false,
    disableEscapeClose: false,
  },
};

export const Confirm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
      setOpen(false);
      alert('Modal closed');
    };

    const handleConfirm = () => {
      alert('Confirmed!');
    };

    return (
      open && (
        <AppModalConfirm
          title="Confirm Action"
          subtitle="Are you sure you want to proceed?"
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      )
    );
  },
};
