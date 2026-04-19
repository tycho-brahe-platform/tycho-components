// ErrorBoundary.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  render: () => {
    // Simulate a runtime error after mount
    setTimeout(() => {
      window.dispatchEvent(
        new ErrorEvent('error', { error: new Error('Simulated global error') })
      );
    }, 500);

    return (
      <ErrorBoundary>
        <div style={{ padding: '1rem' }}>
          <h2>This will be replaced by the ErrorBoundary after the error</h2>
        </div>
      </ErrorBoundary>
    );
  },
};
