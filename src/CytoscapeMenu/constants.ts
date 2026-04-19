export const CXT_MENU_CSS_CLASS = 'cy-context-menus-cxt-menu';
export const MENUITEM_CSS_CLASS = 'cy-context-menus-cxt-menuitem';
export const DIVIDER_CSS_CLASS = 'cy-context-menus-divider';
export const INDICATOR_CSS_CLASS = 'cy-context-menus-submenu-indicator';

export interface MenuItemImage {
  src: string;
  width: number;
  height: number;
  y: string;
  x: string;
}

import type { EventObject } from 'cytoscape';

export interface MenuItemOption {
  id: string;
  content: string;
  tooltipText?: string;
  selector: string;
  disabled?: boolean;
  image?: MenuItemImage;
  show?: boolean;
  submenu?: MenuItemOption[];
  coreAsWell?: boolean;
  onClickFunction?: (event: EventObject) => void;
  hasTrailingDivider?: boolean;
}

export interface SubmenuIndicatorOption {
  src: string;
  width: number;
  height: number;
}

export interface CytoscapeContextMenuOptions {
  evtType?: string;
  menuItems?: MenuItemOption[];
  menuItemClasses?: string[];
  contextMenuClasses?: string[];
  submenuIndicator?: SubmenuIndicatorOption;
}

export const DEFAULT_OPTS: CytoscapeContextMenuOptions = {
  evtType: 'cxttap',
  menuItems: [],
  menuItemClasses: [MENUITEM_CSS_CLASS],
  contextMenuClasses: [CXT_MENU_CSS_CLASS],
  submenuIndicator: {
    src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48cGF0aCBmaWxsPSIjNjY2IiBkPSJNNCA0IEw4IDggTDQgMTIiLz48L3N2Zz4=',
    width: 12,
    height: 12,
  },
};
