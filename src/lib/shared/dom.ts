export function focusElement(element: HTMLElement | null | undefined): void {
  element?.focus({ preventScroll: true });
}

export function getFocusable(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true',
  );
}

export function contains(parent: Node | null | undefined, target: EventTarget | null): boolean {
  return !!parent && target instanceof Node && parent.contains(target);
}
