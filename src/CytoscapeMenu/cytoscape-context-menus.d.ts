import type { CytoscapeContextMenuOptions } from './constants';
import type { ContextMenusInstance } from './cytoscape-context-menus';

declare module 'cytoscape' {
  interface Core {
    contextMenus(
      opts: CytoscapeContextMenuOptions | 'get'
    ): ContextMenusInstance;
  }
}
