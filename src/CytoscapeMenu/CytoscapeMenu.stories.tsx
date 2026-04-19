import type { Meta, StoryObj } from '@storybook/react';
import CytoscapeMenuCanvas from './CytoscapeMenuCanvas';
import type { MenuItemOption } from './constants';

const meta: Meta<typeof CytoscapeMenuCanvas> = {
  title: 'Components/CytoscapeMenu',
  component: CytoscapeMenuCanvas,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    height: { control: 'text' },
    onReady: {
      description: 'Called when Cytoscape instance is ready (receives cy instance)',
      table: { disable: true },
    },
  },
  args: {
    // Use empty callback to avoid SB_PREVIEW_API_0002 (implicit action).
    // Cannot use fn() - Cytoscape Core instance exceeds serialization limits.
    onReady: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof CytoscapeMenuCanvas>;

const customMenuItems: MenuItemOption[] = [
  {
    id: 'remove',
    content: 'Remove',
    tooltipText: 'Remove element',
    selector: 'node, edge',
    onClickFunction: (event) => {
      event.target.remove();
    },
    hasTrailingDivider: true,
  },
  {
    id: 'log',
    content: 'Log to console',
    tooltipText: 'Log element data',
    selector: 'node, edge',
    onClickFunction: (event) => {
      console.log('Element:', event.target.json());
    },
  },
  {
    id: 'fit',
    content: 'Fit to view',
    tooltipText: 'Fit graph to view',
    selector: 'core',
    coreAsWell: true,
    onClickFunction: (event) => {
      event.cy.fit();
    },
  },
];

export const Default: Story = {
  args: {
    id: 'cytoscape-menu-default',
    height: '400px',
  },
};

export const CustomMenuItems: Story = {
  args: {
    id: 'cytoscape-menu-custom',
    menuItems: customMenuItems,
    height: '400px',
  },
};

export const WithSubmenu: Story = {
  args: {
    id: 'cytoscape-menu-submenu',
    menuItems: [
      {
        id: 'remove',
        content: 'Remove',
        tooltipText: 'Remove element',
        selector: 'node, edge',
        onClickFunction: (event) => event.target.remove(),
        hasTrailingDivider: true,
      },
      {
        id: 'actions',
        content: 'More actions',
        tooltipText: 'More options',
        selector: 'node, edge',
        submenu: [
          {
            id: 'select',
            content: 'Select',
            selector: 'node, edge',
            onClickFunction: (event) => {
              event.cy.elements().unselect();
              event.target.select();
            },
          },
          {
            id: 'unselect',
            content: 'Unselect',
            selector: 'node, edge',
            onClickFunction: (event) => {
              event.target.unselect();
            },
          },
        ],
      },
      {
        id: 'fit',
        content: 'Fit to view',
        selector: 'core',
        coreAsWell: true,
        onClickFunction: (event) => {
          (event.cy as { fit: () => void }).fit();
        },
      },
    ],
    height: '400px',
  },
};
