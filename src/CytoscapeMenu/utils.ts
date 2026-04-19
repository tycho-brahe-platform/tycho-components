export function getOffset(el: Element): { top: number; left: number } {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
  };
}

export function matches(el: Element, selector: string): boolean {
  const matchesFn =
    el.matches ||
    (el as Element & { matchesSelector?: (s: string) => boolean }).matchesSelector ||
    (el as Element & { msMatchesSelector?: (s: string) => boolean }).msMatchesSelector ||
    (el as Element & { mozMatchesSelector?: (s: string) => boolean }).mozMatchesSelector ||
    (el as Element & { webkitMatchesSelector?: (s: string) => boolean }).webkitMatchesSelector ||
    (el as Element & { oMatchesSelector?: (s: string) => boolean }).oMatchesSelector;
  return matchesFn.call(el, selector);
}

export function isElementHidden(elem: HTMLElement): boolean {
  const display =
    (elem.style && elem.style.display) || getComputedStyle(elem)['display'];
  return (
    (elem.offsetWidth <= 0 && elem.offsetHeight <= 0) || display === 'none'
  );
}

export function isElementVisible(elem: HTMLElement): boolean {
  return !isElementHidden(elem);
}

export function extend<T extends Record<string, unknown>>(
  defaults: T,
  options: Partial<T>
): T {
  const obj: Record<string, unknown> = {};

  for (const i in defaults) {
    obj[i] = defaults[i];
  }

  for (const i in options) {
    if (obj[i] instanceof Array && options[i] instanceof Array) {
      (obj[i] as unknown[]) = (obj[i] as unknown[]).concat(options[i] as unknown[]);
    } else {
      obj[i] = options[i];
    }
  }

  return obj as T;
}

export function getClassStr(classes: string[]): string {
  return classes.join(' ');
}

export function preventDefaultContextTap(): void {
  const contextMenuAreas = document.getElementsByClassName('cy-context-menus-cxt-menu');

  for (const cxtMenuArea of contextMenuAreas) {
    cxtMenuArea.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

export function setBooleanAttribute(
  element: Element,
  attribute: string,
  boolValue: boolean
): void {
  if (boolValue) {
    element.setAttribute(attribute, '');
  } else {
    element.removeAttribute(attribute);
  }
}

export function isIn(
  { x, y }: { x: number; y: number },
  element: Element
): boolean {
  const rect = element.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function getDimensionsHidden(element: HTMLElement): DOMRect {
  element.style.opacity = '0';
  element.style.display = 'block';

  const rect = element.getBoundingClientRect();

  element.style.opacity = '1';
  element.style.display = 'none';

  return rect;
}

export function defineCustomElement(
  name: string,
  klass: CustomElementConstructor,
  extendsType: string
): void {
  if (typeof customElements.get(name) === 'undefined') {
    customElements.define(name, klass, { extends: extendsType });
  }
}
