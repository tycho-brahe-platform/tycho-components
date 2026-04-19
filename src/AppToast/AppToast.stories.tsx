import type { Meta, StoryObj } from '@storybook/react';
import AppToast from './AppToast';
import { useMessageUtils } from '../configs/useMessageUtils';

const ToastDemo = () => {
  const {
    dispatchLoading,
    dispatchMessageDirect,
  } = useMessageUtils();

  const showLoadingDefault = () => {
    dispatchLoading(true);
    setTimeout(() => dispatchLoading(false), 2000);
  };

  const showLoadingCustom = () => {
    dispatchLoading(true, 'Saving document...');
    setTimeout(() => dispatchLoading(false), 2000);
  };

  const showSuccess = () => {
    dispatchMessageDirect('Operation completed successfully!', 'success');
  };

  const showError = () => {
    dispatchMessageDirect('Something went wrong. Please try again.', 'error');
  };

  const showWarning = () => {
    dispatchMessageDirect('Please review your input before continuing.', 'warning');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 300 }}>
      <p style={{ margin: 0, color: '#666' }}>
        Click a button to trigger a toast. AppToast is rendered globally in the decorator.
      </p>
      <button type="button" onClick={showLoadingDefault}>
        Show loading (default text)
      </button>
      <button type="button" onClick={showLoadingCustom}>
        Show loading (custom text)
      </button>
      <button type="button" onClick={showSuccess}>
        Show success
      </button>
      <button type="button" onClick={showError}>
        Show error
      </button>
      <button type="button" onClick={showWarning}>
        Show warning
      </button>
    </div>
  );
};

const meta: Meta<typeof AppToast> = {
  title: 'Components/AppToast',
  component: AppToast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof AppToast>;

export const Default: Story = {
  render: () => <ToastDemo />,
};

export const LoadingDefault: Story = {
  render: () => {
    const { dispatchLoading } = useMessageUtils();
    return (
      <button
        type="button"
        onClick={() => {
          dispatchLoading(true);
          setTimeout(() => dispatchLoading(false), 3000);
        }}
      >
        Show loading (default text)
      </button>
    );
  },
};

export const LoadingCustomText: Story = {
  render: () => {
    const { dispatchLoading } = useMessageUtils();
    return (
      <button
        type="button"
        onClick={() => {
          dispatchLoading(true, 'Saving document...');
          setTimeout(() => dispatchLoading(false), 3000);
        }}
      >
        Show loading (custom text)
      </button>
    );
  },
};

export const Success: Story = {
  render: () => {
    const { dispatchMessageDirect } = useMessageUtils();
    return (
      <button
        type="button"
        onClick={() =>
          dispatchMessageDirect('Operation completed successfully!', 'success')
        }
      >
        Show success toast
      </button>
    );
  },
};

export const Error: Story = {
  render: () => {
    const { dispatchMessageDirect } = useMessageUtils();
    return (
      <button
        type="button"
        onClick={() =>
          dispatchMessageDirect(
            'Something went wrong. Please try again.',
            'error',
          )
        }
      >
        Show error toast
      </button>
    );
  },
};

export const Warning: Story = {
  render: () => {
    const { dispatchMessageDirect } = useMessageUtils();
    return (
      <button
        type="button"
        onClick={() =>
          dispatchMessageDirect(
            'Please review your input before continuing.',
            'warning',
          )
        }
      >
        Show warning toast
      </button>
    );
  },
};
