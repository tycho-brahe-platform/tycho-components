import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AppPagination from './AppPagination';
import { PaginationState } from '@tanstack/react-table';
import './styles.scss';

const meta: Meta<typeof AppPagination> = {
  title: 'Components/AppPagination',
  component: AppPagination,
  tags: ['autodocs'],
  argTypes: {
    totalElements: { control: 'number' },
    hideItensPage: { control: 'boolean' },
    hidePageTotal: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof AppPagination>;

export const Primary: Story = {
  render: (args) => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    return (
      <AppPagination
        {...args}
        pagination={pagination}
        setPagination={setPagination}
      />
    );
  },
  args: {
    totalElements: 250,
  },
};
