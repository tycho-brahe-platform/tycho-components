import {
  setBooleanAttribute,
  getClassStr,
  isIn,
  getDimensionsHidden,
  defineCustomElement,
} from './utils';
import { DIVIDER_CSS_CLASS } from './constants';
import type { EventObject } from 'cytoscape';
import type { MenuItemOption } from './constants';

export interface Scratchpad {
  cxtMenuItemClasses: string;
  cxtMenuClasses: string;
  submenuIndicatorGen: () => HTMLImageElement;
  currentCyEvent?: EventObject;
  [key: string]: unknown;
}

function stopEvent(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
}

export class MenuItem extends HTMLButtonElement {
  onMenuItemClick!: (event: Event) => void;
  data!: Record<string, unknown>;
  clickFns: (() => void)[] = [];
  selector!: string;
  hasTrailingDivider?: boolean;
  show!: boolean;
  coreAsWell!: boolean;
  scratchpad!: Scratchpad;
  onClickFunction?: (event: EventObject) => void;
  submenu?: MenuItemList;
  indicator?: HTMLImageElement;
  mouseEnterHandler?: (event: MouseEvent) => void;
  mouseLeaveHandler?: (event: MouseEvent) => void;

  constructor(
    params: MenuItemOption,
    onMenuItemClick: (event: Event) => void,
    scratchpad: Scratchpad
  ) {
    super();

    super.setAttribute('id', params.id);

    const className = this._getMenuItemClassStr(
      scratchpad['cxtMenuItemClasses'] as string,
      params.hasTrailingDivider
    );

    super.setAttribute('class', className);

    super.setAttribute('title', params.tooltipText ?? '');

    if (params.disabled) {
      setBooleanAttribute(this, 'disabled', true);
    }

    if (params.image) {
      const img = document.createElement('img');
      img.src = params.image.src;
      img.width = params.image.width;
      img.height = params.image.height;
      img.style.position = 'absolute';
      img.style.top = params.image.y + 'px';
      img.style.left = params.image.x + 'px';

      super.appendChild(img);
    }

    this.innerHTML += params.content;

    this.onMenuItemClick = onMenuItemClick;

    this.data = {};
    this.clickFns = [];
    this.selector = params.selector;
    this.hasTrailingDivider = params.hasTrailingDivider;
    this.show = typeof params.show === 'undefined' || params.show;
    this.coreAsWell = params.coreAsWell || false;
    this.scratchpad = scratchpad;

    if (
      typeof params.onClickFunction === 'undefined' &&
      typeof params.submenu === 'undefined'
    ) {
      throw new Error(
        'A menu item must either have click function or a submenu or both'
      );
    }

    this.onClickFunction = params.onClickFunction;

    if (params.submenu instanceof Array) {
      this._createSubmenu(params.submenu);
    }

    super.addEventListener('mousedown', stopEvent);
    super.addEventListener('mouseup', stopEvent);
    super.addEventListener('touchstart', stopEvent);
    super.addEventListener('touchend', stopEvent);
  }

  bindOnClickFunction(onClickFn: () => void): void {
    this.clickFns.push(onClickFn);
    super.addEventListener('click', onClickFn);
  }

  unbindOnClickFunctions(): void {
    for (const onClickFn of this.clickFns) {
      super.removeEventListener('click', onClickFn);
    }
    this.clickFns = [];
  }

  enable(): void {
    setBooleanAttribute(this, 'disabled', false);

    if (this.hasSubmenu() && this.mouseEnterHandler) {
      this.addEventListener('mouseenter', this.mouseEnterHandler);
    }
  }

  disable(): void {
    setBooleanAttribute(this, 'disabled', true);

    if (this.hasSubmenu() && this.mouseEnterHandler) {
      this.removeEventListener('mouseenter', this.mouseEnterHandler);
    }
  }

  hide(): void {
    this.show = false;
    this.style.display = 'none';
  }

  getHasTrailingDivider(): boolean {
    return this.hasTrailingDivider ? true : false;
  }

  setHasTrailingDivider(status: boolean): void {
    this.hasTrailingDivider = status;
  }

  hasSubmenu(): boolean {
    return this.submenu instanceof MenuItemList;
  }

  appendSubmenuItem(menuItem: MenuItem, before?: Element): void {
    if (!this.hasSubmenu()) {
      this._createSubmenu();
    }
    this.submenu!.appendMenuItem(menuItem, before);
  }

  isClickable(): boolean {
    return this.onClickFunction !== undefined;
  }

  display(): void {
    this.show = true;
    this.style.display = 'block';
  }

  isVisible(): boolean {
    return this.show === true && this.style.display !== 'none';
  }

  removeSubmenu(): void {
    if (this.hasSubmenu()) {
      this.submenu!.removeAllMenuItems();
      this.detachSubmenu();
    }
  }

  detachSubmenu(): void {
    if (this.hasSubmenu()) {
      this.removeChild(this.submenu!);
      this.removeChild(this.indicator!);
      this.removeEventListener('mouseenter', this.mouseEnterHandler!);
      this.removeEventListener('mouseleave', this.mouseLeaveHandler!);
      this.submenu = undefined;
      this.indicator = undefined;
    }
  }

  _onMouseEnter(_event: MouseEvent): void {
    const rect = this.getBoundingClientRect();
    const submenuRect = getDimensionsHidden(this.submenu!);

    const exceedsRight = rect.right + submenuRect.width > window.innerWidth;
    const exceedsBottom = rect.top + submenuRect.height > window.innerHeight;

    if (!exceedsRight && !exceedsBottom) {
      this.submenu!.style.left = this.clientWidth + 'px';
      this.submenu!.style.top = '0px';
      this.submenu!.style.right = 'auto';
      this.submenu!.style.bottom = 'auto';
    } else if (exceedsRight && !exceedsBottom) {
      this.submenu!.style.right = this.clientWidth + 'px';
      this.submenu!.style.top = '0px';
      this.submenu!.style.left = 'auto';
      this.submenu!.style.bottom = 'auto';
    } else if (exceedsRight && exceedsBottom) {
      this.submenu!.style.right = this.clientWidth + 'px';
      this.submenu!.style.bottom = '0px';
      this.submenu!.style.top = 'auto';
      this.submenu!.style.left = 'auto';
    } else {
      this.submenu!.style.left = this.clientWidth + 'px';
      this.submenu!.style.bottom = '0px';
      this.submenu!.style.right = 'auto';
      this.submenu!.style.top = 'auto';
    }

    this.submenu!.display();

    const visibleItems = Array.from(this.submenu!.children).filter((item) => {
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
  }

  _onMouseLeave(event: MouseEvent): void {
    const pos = { x: event.clientX, y: event.clientY };

    if (!isIn(pos, this.submenu!)) {
      this.submenu!.hide();
    }
  }

  _createSubmenu(items: MenuItemOption[] = []): void {
    this.indicator = this.scratchpad['submenuIndicatorGen']() as HTMLImageElement;
    this.submenu = new MenuItemList(this.onMenuItemClick, this.scratchpad);

    this.appendChild(this.indicator);
    this.appendChild(this.submenu);

    for (const item of items) {
      const menuItem = new MenuItem(item, this.onMenuItemClick, this.scratchpad);
      this.submenu.appendMenuItem(menuItem);
    }

    this.mouseEnterHandler = this._onMouseEnter.bind(this);
    this.mouseLeaveHandler = this._onMouseLeave.bind(this);

    this.addEventListener('mouseenter', this.mouseEnterHandler);
    this.addEventListener('mouseleave', this.mouseLeaveHandler);
  }

  _getMenuItemClassStr(classStr: string, hasTrailingDivider?: boolean): string {
    return hasTrailingDivider
      ? classStr + ' ' + DIVIDER_CSS_CLASS
      : classStr;
  }

  static define(): void {
    defineCustomElement('ctx-menu-item', MenuItem, 'button');
  }
}

export class MenuItemList extends HTMLDivElement {
  onMenuItemClick!: (event: Event) => void;
  scratchpad!: Scratchpad;

  constructor(onMenuItemClick: (event: Event) => void, scratchpad: Scratchpad) {
    super();

    super.setAttribute('class', scratchpad['cxtMenuClasses'] as string);

    this.style.position = 'absolute';

    this.onMenuItemClick = onMenuItemClick;
    this.scratchpad = scratchpad;
  }

  hide(): void {
    if (this.isVisible()) {
      this.hideSubmenus();
      this.style.display = 'none';
    }
  }

  display(): void {
    this.style.display = 'block';
  }

  isVisible(): boolean {
    return this.style.display !== 'none';
  }

  hideMenuItems(): void {
    for (const item of this.children) {
      if (item instanceof HTMLElement) {
        item.style.display = 'none';
      } else {
        console.warn(`${item} is not a HTMLElement`);
      }
    }
  }

  hideSubmenus(): void {
    for (const menuItem of this.children) {
      if (menuItem instanceof MenuItem) {
        if (menuItem.submenu) {
          menuItem.submenu.hide();
        }
      }
    }
  }

  appendMenuItem(menuItem: MenuItem, before?: Element): void {
    if (typeof before !== 'undefined') {
      if (before.parentNode === this) {
        this.insertBefore(menuItem, before);
      } else {
        throw new Error(
          `The item with id='${(before as Element).id}' is not a child of the context menu`
        );
      }
    } else {
      this.appendChild(menuItem);
    }

    if (menuItem.isClickable()) {
      this._performBindings(menuItem);
    }
  }

  moveBefore(menuItem: MenuItem, before: MenuItem): void {
    if (menuItem.parentNode !== this) {
      throw new Error(
        `The item with id='${menuItem.id}' is not a child of context menu`
      );
    }
    if (before.parentNode !== this) {
      throw new Error(
        `The item with id='${before.id}' is not a child of context menu`
      );
    }

    this.removeChild(menuItem);
    this.insertBefore(menuItem, before);
  }

  removeAllMenuItems(): void {
    while (this.firstChild) {
      const child = this.lastChild;
      if (child instanceof MenuItem) {
        this._removeImmediateMenuItem(child);
      } else {
        console.warn('Found non menu item in the context menu: ', child);
        this.removeChild(child!);
      }
    }
  }

  _removeImmediateMenuItem(menuItem: MenuItem): void {
    if (this._detachImmediateMenuItem(menuItem)) {
      menuItem.detachSubmenu();
      menuItem.unbindOnClickFunctions();
    } else {
      throw new Error(
        `menu item(id=${menuItem.id}) is not in the context menu`
      );
    }
  }

  _detachImmediateMenuItem(menuItem: MenuItem): boolean {
    if (menuItem.parentNode === this) {
      this.removeChild(menuItem);

      if (this.children.length <= 0) {
        const parent = this.parentNode;
        if (parent instanceof MenuItem) {
          parent.detachSubmenu();
        }
      }

      return true;
    }
    return false;
  }

  _performBindings(menuItem: MenuItem): void {
    const callback = this._bindOnClick(menuItem.onClickFunction!);
    menuItem.bindOnClickFunction(callback);
    menuItem.bindOnClickFunction(this.onMenuItemClick as () => void);
  }

  _bindOnClick(onClickFn: (event: EventObject) => void): () => void {
    return () => {
      const event = this.scratchpad['currentCyEvent'] as EventObject;
      onClickFn(event);
    };
  }

  static define(): void {
    defineCustomElement('menu-item-list', MenuItemList, 'div');
  }
}

export class ContextMenu extends MenuItemList {
  constructor(onMenuItemClick: () => void, scratchpad: Scratchpad) {
    super(onMenuItemClick, scratchpad);

    this.onMenuItemClick = (event: Event) => {
      stopEvent(event);
      this.hide();
      onMenuItemClick();
    };
  }

  removeMenuItem(menuItem: MenuItem): void {
    const parent = menuItem.parentElement;

    if (parent instanceof MenuItemList && this.contains(parent)) {
      parent._removeImmediateMenuItem(menuItem);
    }
  }

  appendMenuItem(menuItem: MenuItem, before?: Element): void {
    this.ensureDoesntContain(menuItem.id);
    super.appendMenuItem(menuItem, before);
  }

  insertMenuItem(
    menuItem: MenuItem,
    { before, parent }: { before?: MenuItem; parent?: MenuItem } = {}
  ): void {
    this.ensureDoesntContain(menuItem.id);

    if (typeof before !== 'undefined') {
      if (this.contains(before)) {
        const parentNode = before.parentNode;
        if (parentNode instanceof MenuItemList) {
          parentNode.appendMenuItem(menuItem, before);
        } else {
          throw new Error(
            `Parent of before(id=${before.id}) is not a submenu`
          );
        }
      } else {
        throw new Error(
          `before(id=${before.id}) is not in the context menu`
        );
      }
    } else if (typeof parent !== 'undefined') {
      if (this.contains(parent)) {
        parent.appendSubmenuItem(menuItem);
      } else {
        throw new Error(
          `parent(id=${parent.id}) is not a descendant of the context menu`
        );
      }
    } else {
      this.appendMenuItem(menuItem);
    }
  }

  moveBefore(menuItem: MenuItem, before: MenuItem): void {
    const parent = menuItem.parentElement;
    if (this.contains(parent!)) {
      if (this.contains(before)) {
        parent!.removeChild(menuItem);
        this.insertMenuItem(menuItem, { before });
      } else {
        throw new Error(
          `before(id=${before.id}) is not in the context menu`
        );
      }
    } else {
      throw new Error(
        `parent(id=${parent?.id}) is not in the context menu`
      );
    }
  }

  moveToSubmenu(
    menuItem: MenuItem,
    parent: MenuItem | null = null,
    options: { selector?: string; coreAsWell?: boolean } | null = null
  ): void {
    const oldParent = menuItem.parentElement;
    if (oldParent instanceof MenuItemList) {
      if (this.contains(oldParent)) {
        if (parent !== null) {
          if (this.contains(parent)) {
            oldParent._detachImmediateMenuItem(menuItem);
            parent.appendSubmenuItem(menuItem);
          } else {
            throw new Error(
              `parent(id=${parent.id}) is not in the context menu`
            );
          }
        } else {
          if (options !== null) {
            menuItem.selector = options.selector ?? menuItem.selector;
            menuItem.coreAsWell = options.coreAsWell ?? menuItem.coreAsWell;
          }

          oldParent._detachImmediateMenuItem(menuItem);
          this.appendMenuItem(menuItem);
        }
      } else {
        throw new Error(
          `parent of the menu item(id=${oldParent.id}) is not in the context menu`
        );
      }
    } else {
      throw new Error(
        `current parent(id=${oldParent?.id}) is not a submenu`
      );
    }
  }

  ensureDoesntContain(id: string): void {
    const elem = document.getElementById(id);
    if (typeof elem !== 'undefined' && elem && this.contains(elem)) {
      throw new Error(
        `There is already an element with id=${id} in the context menu`
      );
    }
  }

  static define(): void {
    defineCustomElement('ctx-menu', ContextMenu, 'div');
  }
}
