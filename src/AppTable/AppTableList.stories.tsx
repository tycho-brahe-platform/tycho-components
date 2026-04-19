import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppTableList from './AppTableList';
import { ColumnDef } from '@tanstack/react-table';

type Story = StoryObj<typeof AppTableList>;

// Sample data type
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: string;
};

// Sample columns for the table
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    size: 80,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 200,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 100,
  },
];

// Generate some mock data for demonstration
const createData = (id: number): Person => ({
  id,
  firstName: `First${id}`,
  lastName: `Last${id}`,
  age: 20 + (id % 30),
  email: `user${id}@example.com`,
  status: id % 2 === 0 ? 'Active' : 'Inactive',
});

const data = Array.from({ length: 20 }, (_, i) => createData(i + 1));

const meta: Meta<typeof AppTableList> = {
  title: 'Components/AppTableList',
  component: AppTableList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList columns={columns} data={data} />
      </div>
    );
  },
};

export const WithClickHandler: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList
          columns={columns}
          data={data}
          onClickRow={(row) => {
            alert(`Clicked row with id: ${row.id}, name: ${row.firstName} ${row.lastName}`);
          }}
        />
      </div>
    );
  },
};

export const WithHiddenColumns: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList
          columns={columns}
          data={data}
          hiddenColumns={['id', 'email']}
        />
      </div>
    );
  },
};

export const WithFilter: Story = {
  render: () => {
    const [filter, setFilter] = useState<[string, string] | undefined>(undefined);

    return (
      <div style={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Filter by First Name:
            <input
              type="text"
              value={filter?.[1] || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFilter(value ? ['firstName', value] : undefined);
              }}
              placeholder="Enter first name..."
              style={{ marginLeft: 8, padding: '4px 8px' }}
            />
          </label>
        </div>
        <AppTableList
          columns={columns}
          data={data}
          filter={filter}
        />
      </div>
    );
  },
};

export const WithMouseEvents: Story = {
  render: () => {
    const [hoveredRow, setHoveredRow] = useState<Person | null>(null);

    return (
      <div style={{ padding: 20 }}>
        {hoveredRow && (
          <div style={{ marginBottom: 16, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            Hovering over: {hoveredRow.firstName} {hoveredRow.lastName} (ID: {hoveredRow.id})
          </div>
        )}
        <AppTableList
          columns={columns}
          data={data}
          onMouseEnter={(row) => setHoveredRow(row.original)}
          onMouseLeave={() => setHoveredRow(null)}
          onClickRow={(row) => {
            alert(`Clicked: ${row.firstName} ${row.lastName}`);
          }}
        />
      </div>
    );
  },
};

export const WithCustomClassName: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList
          columns={columns}
          data={data}
          className="custom-table-class"
        />
      </div>
    );
  },
};

export const EmptyData: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList columns={columns} data={[]} />
      </div>
    );
  },
};

export const SingleRow: Story = {
  render: () => {
    return (
      <div style={{ padding: 20 }}>
        <AppTableList columns={columns} data={[createData(1)]} />
      </div>
    );
  },
};
