import cytoscape, { Core } from 'cytoscape';
import { useEffect, useRef } from 'react';
import { registerCytoscapeContextMenus } from './index';
import type { ContextMenusInstance } from './cytoscape-context-menus';
import type { CytoscapeContextMenuOptions, MenuItemOption } from './constants';
import './style.scss';

registerCytoscapeContextMenus(cytoscape);

export interface CytoscapeMenuCanvasProps {
  /** Unique id for the container element */
  id?: string;
  /** Cytoscape elements (nodes and edges) */
  elements?: cytoscape.ElementDefinition[];
  /** Context menu options */
  menuItems?: MenuItemOption[];
  /** Called when cytoscape instance is ready */
  onReady?: (cy: Core) => void;
  /** Additional context menu options */
  contextMenuOptions?: Omit<CytoscapeContextMenuOptions, 'menuItems'>;
  /** Container height */
  height?: string | number;
}

const DEFAULT_ELEMENTS: cytoscape.ElementDefinition[] = [
  { data: { id: 'a', label: 'Node A' } },
  { data: { id: 'b', label: 'Node B' } },
  { data: { id: 'c', label: 'Node C' } },
  { data: { id: 'ab', source: 'a', target: 'b' } },
  { data: { id: 'bc', source: 'b', target: 'c' } },
];

export default function CytoscapeMenuCanvas({
  id = 'cytoscape-menu-canvas',
  elements = DEFAULT_ELEMENTS,
  menuItems = [],
  onReady,
  contextMenuOptions = {},
  height = '400px',
}: CytoscapeMenuCanvasProps) {
  const cyRef = useRef<Core | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = document.getElementById(id);
    if (!container) return;

    container.innerHTML = '';

    const cy = cytoscape({
      container,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#4a90d9',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            padding: '8px',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
      ],
      layout: { name: 'grid' },
    });

    const menuOptions: CytoscapeContextMenuOptions = {
      menuItems: menuItems.length > 0 ? menuItems : [
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
          id: 'select',
          content: 'Select',
          tooltipText: 'Select element',
          selector: 'node, edge',
          onClickFunction: (event) => {
            cy.elements().unselect();
            event.target.select();
          },
        },
        {
          id: 'fit',
          content: 'Fit to view',
          tooltipText: 'Fit graph to view',
          selector: 'core',
          coreAsWell: true,
          onClickFunction: () => {
            cy.fit();
          },
        },
      ],
      ...contextMenuOptions,
    };

    const contextMenusInstance = (cy as Core & { contextMenus: (o: CytoscapeContextMenuOptions) => ContextMenusInstance }).contextMenus(menuOptions);
    cyRef.current = cy;

    onReady?.(cy);

    return () => {
      contextMenusInstance.destroy();
      cy.destroy();
      cyRef.current = null;
    };
  }, [id, elements, menuItems, contextMenuOptions, onReady]);

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: '100%' }}
      className="cytoscape-menu-canvas"
    />
  );
}
