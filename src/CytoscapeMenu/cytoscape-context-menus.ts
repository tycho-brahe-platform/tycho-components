import type { Collection, Core, EventObject, NodeSingular } from 'cytoscape';
import * as utils from './utils';
import {
  DEFAULT_OPTS,
  DIVIDER_CSS_CLASS,
  INDICATOR_CSS_CLASS,
} from './constants';
import type { CytoscapeContextMenuOptions, MenuItemOption } from './constants';
import { MenuItem, ContextMenu, MenuItemList } from './context-menu';

export interface ContextMenusInstance {
  isActive: () => boolean;
  appendMenuItem: (item: MenuItemOption, parentID?: string) => Core;
  appendMenuItems: (items: MenuItemOption[], parentID?: string) => Core;
  removeMenuItem: (itemID: string) => Core;
  hide: () => void;
  setTrailingDivider: (itemID: string, status: boolean) => Core;
  insertBeforeMenuItem: (item: MenuItemOption, existingItemID: string) => Core;
  moveToSubmenu: (
    itemID: string,
    options?: string | { coreAsWell?: boolean; selector?: string }
  ) => Core;
  moveBeforeOtherMenuItem: (itemID: string, existingItemID: string) => Core;
  disableMenuItem: (itemID: string) => Core;
  enableMenuItem: (itemID: string) => Core;
  hideMenuItem: (itemID: string) => Core;
  showMenuItem: (itemID: string) => Core;
  destroy: () => Core;
}

export function contextMenus(
  this: Core,
  opts: CytoscapeContextMenuOptions | 'get'
): ContextMenusInstance {
  const cy = this;

  if (!cy.scratch('cycontextmenus')) {
    cy.scratch('cycontextmenus', {});
  }

  const getScratchProp = <T>(propname: string): T =>
    cy.scratch('cycontextmenus')[propname];

  const setScratchProp = <T>(propname: string, value: T): T =>
    (cy.scratch('cycontextmenus')[propname] = value);

  let cxtMenu: ContextMenu | undefined = getScratchProp<ContextMenu>('cxtMenu');
  let options: CytoscapeContextMenuOptions = getScratchProp('options');

  const getVariation = (position?: { x: number; y: number }) => {
    if (typeof position === 'undefined') return { x: 0, y: 0 };
    return { x: -200, y: 50 };
  };

  const addPositionToEvent = (
    event: EventObject,
    position?: { x: number; y: number }
  ) => {
    if (typeof position === 'undefined') return;
    const cyPos = event.position || (event as EventObject & { cyPosition?: { x: number; y: number } }).cyPosition;
    if (typeof cyPos === 'undefined') {
      (event as EventObject & { position?: { x: number; y: number } }).position = position;
    }

    const renderedPos =
      event.renderedPosition ||
      (event as EventObject & { cyRenderedPosition?: { x: number; y: number } }).cyRenderedPosition;
    if (typeof renderedPos === 'undefined') {
      (event as EventObject & { renderedPosition?: { x: number; y: number } }).renderedPosition = position;
    }
  };

  const bindOnCxttap = () => {
    const onCxttap = (
      event: EventObject,
      position?: { x: number; y: number },
      someNode?: NodeSingular
    ) => {
      if (typeof someNode !== 'undefined') {
        (event as EventObject & { data?: { node: NodeSingular } }).data = { node: someNode };
      }
      setScratchProp('currentCyEvent', event);
      adjustCxtMenu(event, position);

      const target = event.target || (event as EventObject & { cyTarget?: Collection }).cyTarget;

      for (const menuItem of cxtMenu!.children) {
        if (menuItem instanceof MenuItem) {
          const shouldDisplay =
            target === cy
              ? menuItem.coreAsWell
              : target.is(menuItem.selector);
          if (shouldDisplay && menuItem.show) {
            cxtMenu!.display();
            setScratchProp('anyVisibleChild', true);
            menuItem.display();
          }
        }
      }

      const visibleItems = Array.from(cxtMenu!.children).filter((item) => {
        if (item instanceof MenuItem) return item.isVisible();
        return false;
      });
      const length = visibleItems.length;
      visibleItems.forEach((item, index) => {
        if (!(item instanceof MenuItem)) return;

        if (index < length - 1 && item.getHasTrailingDivider()) {
          item.classList.add(DIVIDER_CSS_CLASS);
        } else if (item.getHasTrailingDivider()) {
          item.classList.remove(DIVIDER_CSS_CLASS);
        }
      });

      if (
        !getScratchProp<boolean>('anyVisibleChild') &&
        utils.isElementVisible(cxtMenu!)
      ) {
        cxtMenu!.hide();
      }
    };

    cy.on(options.evtType!, onCxttap);
    setScratchProp('onCxttap', onCxttap);
  };

  const bindCyEvents = () => {
    const eventCyTapStart = (event: EventObject) => {
      if (cxtMenu!.contains((event.originalEvent as Event).target as Node)) {
        return false;
      }
      cxtMenu!.hide();
      setScratchProp('cxtMenuPosition', undefined);
      setScratchProp('currentCyEvent', undefined);
    };

    cy.on('tapstart', eventCyTapStart);
    setScratchProp('eventCyTapStart', eventCyTapStart);

    const eventCyViewport = () => {
      cxtMenu!.hide();
    };

    cy.on('viewport', eventCyViewport);
    setScratchProp('onViewport', eventCyViewport);
  };

  const bindHideCallbacks = () => {
    const onClick = (event: MouseEvent) => {
      const cyContainer = cy.container();
      if (
        !cyContainer!.contains(event.target as Node) &&
        !cxtMenu!.contains(event.target as Node)
      ) {
        cxtMenu!.hide();
        setScratchProp('cxtMenuPosition', undefined);
      }
    };

    document.addEventListener('mouseup', onClick);
    setScratchProp('hideOnNonCyClick', onClick);
  };

  const adjustCxtMenu = (
    event: EventObject,
    position?: { x: number; y: number }
  ) => {
    const container = cy.container()!;
    const currentCxtMenuPosition = getScratchProp<{ x: number; y: number } | undefined>('cxtMenuPosition');

    addPositionToEvent(event, position);

    const cyPos =
      event.position ||
      (event as EventObject & { cyPosition?: { x: number; y: number } }).cyPosition;

    if (currentCxtMenuPosition != cyPos) {
      cxtMenu!.hideMenuItems();
      setScratchProp('anyVisibleChild', false);
      setScratchProp('cxtMenuPosition', cyPos);

      const containerPos = utils.getOffset(container);
      const renderedPos =
        event.renderedPosition ||
        (event as EventObject & { cyRenderedPosition?: { x: number; y: number } }).cyRenderedPosition;

      const borderWidth = getComputedStyle(container).getPropertyValue('border-width');
      const borderThickness = parseInt(borderWidth.replace('px', ''), 10) || 0;
      if (borderThickness > 0) {
        containerPos.top += borderThickness;
        containerPos.left += borderThickness;
      }
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      const horizontalSplit = containerHeight / 2;
      const verticalSplit = containerWidth / 2;

      const variation = getVariation(position);
      if (renderedPos.y > horizontalSplit && renderedPos.x <= verticalSplit) {
        cxtMenu!.style.left = renderedPos.x - variation.x + 'px';
        cxtMenu!.style.bottom =
          containerHeight - renderedPos.y + variation.y + 'px';
        cxtMenu!.style.right = 'auto';
        cxtMenu!.style.top = 'auto';
      } else if (
        renderedPos.y > horizontalSplit &&
        renderedPos.x > verticalSplit
      ) {
        cxtMenu!.style.right =
          containerWidth - renderedPos.x - variation.x + 'px';
        cxtMenu!.style.bottom =
          containerHeight - renderedPos.y + variation.y + 'px';
        cxtMenu!.style.left = 'auto';
        cxtMenu!.style.top = 'auto';
      } else if (
        renderedPos.y <= horizontalSplit &&
        renderedPos.x <= verticalSplit
      ) {
        cxtMenu!.style.left = renderedPos.x - variation.x + 'px';
        cxtMenu!.style.top = renderedPos.y + variation.y + 'px';
        cxtMenu!.style.right = 'auto';
        cxtMenu!.style.bottom = 'auto';
      } else {
        cxtMenu!.style.right =
          containerWidth - renderedPos.x - variation.x + 'px';
        cxtMenu!.style.top = renderedPos.y + 'px';
        cxtMenu!.style.left = 'auto';
        cxtMenu!.style.bottom = 'auto';
      }
    }
  };

  const createAndAppendMenuItemComponent = (
    opts: MenuItemOption,
    parentID?: string
  ) => {
    const menuItemComponent = createMenuItemComponent(opts);

    if (typeof parentID !== 'undefined') {
      const parent = asMenuItem(parentID);
      cxtMenu!.insertMenuItem(menuItemComponent, { parent });
    } else {
      cxtMenu!.insertMenuItem(menuItemComponent);
    }
  };

  const createAndAppendMenuItemComponents = (
    optionsArr: MenuItemOption[],
    parentID?: string
  ) => {
    for (let i = 0; i < optionsArr.length; i++) {
      createAndAppendMenuItemComponent(optionsArr[i], parentID);
    }
  };

  const createMenuItemComponent = (opts: MenuItemOption): MenuItem => {
    const scratchpad = cy.scratch('cycontextmenus');
    return new MenuItem(opts, cxtMenu!.onMenuItemClick, scratchpad);
  };

  const destroyCxtMenu = () => {
    if (!getScratchProp<boolean>('active')) {
      return;
    }

    cxtMenu!.removeAllMenuItems();

    cy.off('tapstart', getScratchProp('eventCyTapStart'));
    cy.off(options.evtType!, getScratchProp('onCxttap'));
    cy.off('viewport', getScratchProp('onViewport'));
    document.removeEventListener('mouseup', getScratchProp('hideOnNonCyClick'));

    cxtMenu!.parentNode!.removeChild(cxtMenu!);
    cxtMenu = undefined;

    setScratchProp('cxtMenu', undefined);
    setScratchProp('active', false);
    setScratchProp('anyVisibleChild', false);
    setScratchProp('onCxttap', undefined);
    setScratchProp('onViewport', undefined);
    setScratchProp('hideOnNonCyClick', undefined);
  };

  const makeSubmenuIndicator = (props: {
    src: string;
    width: number;
    height: number;
  }) => {
    const elem = document.createElement('img');
    elem.src = props.src;
    elem.width = props.width;
    elem.height = props.height;
    elem.classList.add(INDICATOR_CSS_CLASS);
    return elem;
  };

  const asMenuItem = (menuItemID: string): MenuItem => {
    const menuItem = document.getElementById(menuItemID);
    if (menuItem instanceof MenuItem) {
      return menuItem;
    }
    throw new Error(
      `The item with id=${menuItemID} is not a menu item`
    );
  };

  const getInstance = (): ContextMenusInstance => {
    const getCxtMenu = () => getScratchProp<ContextMenu>('cxtMenu');
    return {
      isActive: () => getScratchProp<boolean>('active'),
      appendMenuItem: (item, parentID) => {
        createAndAppendMenuItemComponent(item, parentID);
        return cy;
      },
      appendMenuItems: (items, parentID) => {
        createAndAppendMenuItemComponents(items, parentID);
        return cy;
      },
      removeMenuItem: (itemID) => {
        const item = asMenuItem(itemID);
        getCxtMenu()?.removeMenuItem(item);
        return cy;
      },
      hide: () => {
        getCxtMenu()?.hide();
      },
    setTrailingDivider: (itemID, status) => {
      const menuItem = asMenuItem(itemID);
      menuItem.setHasTrailingDivider(status);

      if (status) {
        menuItem.classList.add(DIVIDER_CSS_CLASS);
      } else {
        menuItem.classList.remove(DIVIDER_CSS_CLASS);
      }
      return cy;
    },
    insertBeforeMenuItem: (item, existingItemID) => {
      const menuItemComponent = createMenuItemComponent(item);
      const existingItem = asMenuItem(existingItemID);
      getCxtMenu()?.insertMenuItem(menuItemComponent, { before: existingItem });
      return cy;
    },
    moveToSubmenu: (itemID, optionsParam) => {
      const item = asMenuItem(itemID);
      const menu = getCxtMenu();

      if (optionsParam === undefined || optionsParam === null) {
        menu?.moveToSubmenu(item);
      } else if (typeof optionsParam === 'string') {
        const parent = asMenuItem(optionsParam);
        menu?.moveToSubmenu(item, parent);
      } else if (
        typeof (optionsParam as { coreAsWell?: boolean }).coreAsWell !==
          'undefined' ||
        typeof (optionsParam as { selector?: string }).selector !== 'undefined'
      ) {
        menu?.moveToSubmenu(item, null, optionsParam);
      } else {
        console.warn(
          'options neither has coreAsWell nor selector property but it is an object. Are you sure that this is what you want to do?'
        );
      }

      return cy;
    },
    moveBeforeOtherMenuItem: (itemID, existingItemID) => {
      const item = asMenuItem(itemID);
      const before = asMenuItem(existingItemID);
      getCxtMenu()?.moveBefore(item, before);
      return cy;
    },
    disableMenuItem: (itemID) => {
      const menuItem = asMenuItem(itemID);
      menuItem.disable();
      return cy;
    },
    enableMenuItem: (itemID) => {
      const menuItem = asMenuItem(itemID);
      menuItem.enable();
      return cy;
    },
    hideMenuItem: (itemID) => {
      const menuItem = asMenuItem(itemID);
      menuItem.hide();
      return cy;
    },
    showMenuItem: (itemID) => {
      const menuItem = asMenuItem(itemID);
      menuItem.display();
      return cy;
    },
    destroy: () => {
      destroyCxtMenu();
      return cy;
    },
    };
  };

  if (opts !== 'get') {
    MenuItem.define();
    MenuItemList.define();
    ContextMenu.define();

    options = utils.extend(DEFAULT_OPTS as Record<string, unknown>, opts as Record<string, unknown>) as CytoscapeContextMenuOptions;
    setScratchProp('options', options);

    if (getScratchProp<boolean>('active')) {
      destroyCxtMenu();
    }

    setScratchProp('active', true);

    setScratchProp(
      'submenuIndicatorGen',
      makeSubmenuIndicator.bind(
        undefined,
        options.submenuIndicator || DEFAULT_OPTS.submenuIndicator!
      )
    );

    const cxtMenuClasses = utils.getClassStr(
      options.contextMenuClasses || DEFAULT_OPTS.contextMenuClasses!
    );
    setScratchProp('cxtMenuClasses', cxtMenuClasses);

    const onMenuItemClick = () => setScratchProp('cxtMenuPosition', undefined);

    const scratchpad = cy.scratch('cycontextmenus');
    cxtMenu = new ContextMenu(onMenuItemClick, scratchpad);

    setScratchProp('cxtMenu', cxtMenu);
    cy.container()!.appendChild(cxtMenu);

    setScratchProp(
      'cxtMenuItemClasses',
      utils.getClassStr(options.menuItemClasses || DEFAULT_OPTS.menuItemClasses!)
    );
    const menuItems = options.menuItems || [];
    createAndAppendMenuItemComponents(menuItems);

    bindOnCxttap();
    bindCyEvents();
    bindHideCallbacks();

    utils.preventDefaultContextTap();
  }

  return getInstance();
}
