import { createContext } from 'svelte';
import type { Direction, Orientation } from '../shared/types.js';
import { moveRovingFocus } from '../shared/roving-focus.js';

export type AccordionValue = string | string[] | null;

export class AccordionState {
  values = $state<string[]>([]);
  multiple = $state(false);
  disabled = $state(false);
  orientation = $state<Orientation>('vertical');
  direction = $state<Direction>('ltr');
  loop = $state(true);
  element = $state<HTMLDivElement | null>(null);
  toggle: (value: string, event: Event) => void = () => {};

  isOpen(value: string): boolean {
    return this.values.includes(value);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.element || !(event.currentTarget instanceof HTMLElement)) return;
    const candidates = Array.from(
      this.element.querySelectorAll<HTMLElement>('[data-base-ui-accordion-trigger]'),
    );
    moveRovingFocus({
      current: event.currentTarget,
      candidates,
      event,
      orientation: this.orientation,
      direction: this.direction,
      loop: this.loop,
    });
  }
}

export class AccordionItemState {
  value = $state('');
  disabled = $state(false);
  triggerId = $state('');
  panelId = $state('');
}

export const [getAccordionContext, setAccordionContext] = createContext<AccordionState>();
export const [getAccordionItemContext, setAccordionItemContext] = createContext<AccordionItemState>();
