import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import AppTable from './AppTable';
import {
  ColumnDef,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { AppPage } from './types/AppPage';

type Story = StoryObj<typeof AppTable>;

// Sample data type
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
};

// Sample columns for the table
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 10,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 20,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 20,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    size: 10,
  },
  {
    accessorKey: 'visits',
    header: 'Visits',
    size: 10,
  },
];

// Generate some mock data for demonstration
const createData = (id: number): Person => ({
  id,
  firstName: `First${id}`,
  lastName: `Last${id}`,
  age: 20 + (id % 30),
  visits: id * 3,
});

const dataContent = Array.from({ length: 50 }, (_, i) => createData(i + 1));

// Mock AppPage data shape
const data: AppPage<Person> = {
  content: dataContent.slice(0, 10),
  totalPages: Math.ceil(dataContent.length / 10),
  totalElements: dataContent.length,
  number: 0,
  size: 10,
  seed: 0,
};

const meta: Meta<typeof AppTable> = {
  title: 'Components/AppTable',
  component: AppTable,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: Story = {
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    // Simulate server-side pagination by slicing dataContent per pageIndex and pageSize
    const pageContent = dataContent.slice(
      pagination.pageIndex * pagination.pageSize,
      pagination.pageIndex * pagination.pageSize + pagination.pageSize
    );

    const pageData: AppPage<Person> = {
      content: pageContent,
      totalPages: Math.ceil(dataContent.length / pagination.pageSize),
      totalElements: dataContent.length,
      number: 0,
      size: 10,
      seed: 0,
    };

    return (
      <div style={{ padding: 20 }}>
        <AppTable
          columns={columns}
          data={pageData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          className="my-app-table"
          onClickRow={(row) => alert(`Clicked row with id: ${row.id}`)}
        />
      </div>
    );
  },
};

export const SingleRow: Story = {
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    // Single row data
    const singleRowData: AppPage<Person> = {
      content: [createData(1)],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 10,
      seed: 0,
    };

    return (
      <div style={{ padding: 20 }}>
        <AppTable
          columns={columns}
          data={singleRowData}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          className="my-app-table"
          onClickRow={(row) => alert(`Clicked row with id: ${row.id}`)}
        />
      </div>
    );
  },
};
