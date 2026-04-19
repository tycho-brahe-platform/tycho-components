import type { Meta, StoryObj } from '@storybook/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import NotFound from './NotFound';

const router = createMemoryRouter([
  {
    path: '/',
    element: <NotFound />,
  },
]);

const meta: Meta<typeof NotFound> = {
  title: 'Components/NotFound',
  component: NotFound,
  decorators: [() => <RouterProvider router={router} />],
};

export default meta;

type Story = StoryObj<typeof NotFound>;

export const Default: Story = {};
