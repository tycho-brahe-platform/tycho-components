import cytoscape from 'cytoscape';
import { contextMenus } from './cytoscape-context-menus';

export type { CytoscapeContextMenuOptions, MenuItemOption } from './constants';
export type { ContextMenusInstance } from './cytoscape-context-menus';
export { contextMenus };

export function registerCytoscapeContextMenus(cy?: typeof cytoscape): void {
  const target = cy ?? (typeof cytoscape !== 'undefined' ? cytoscape : undefined);
  if (!target) {
    return;
  }
  target('core', 'contextMenus', contextMenus);
}

if (typeof cytoscape !== 'undefined') {
  registerCytoscapeContextMenus(cytoscape);
}
