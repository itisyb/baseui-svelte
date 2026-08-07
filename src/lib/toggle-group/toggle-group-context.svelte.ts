import { createContext, untrack } from 'svelte';
import type { Direction, Orientation } from '../shared/types.js';
import { moveRovingFocus } from '../shared/roving-focus.js';

export type ToggleGroupValue = string | string[] | null;

export class ToggleGroupState {
  values = $state<string[]>([]);
  multiple = $state(false);
  disabled = $state(false);
  orientation = $state<Orientation>('horizontal');
  direction = $state<Direction>('ltr');
  loop = $state(true);
  items = $state<HTMLElement[]>([]);
  toggle: (value: string, event: Event) => void = () => {};

  register(item: HTMLElement): () => void {
    untrack(() => { this.items = [...this.items, item]; });
    return () => { untrack(() => { this.items = this.items.filter((candidate) => candidate !== item); }); };
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    moveRovingFocus({
      current: event.currentTarget,
      candidates: this.items,
      event,
      orientation: this.orientation,
      direction: this.direction,
      loop: this.loop,
    });
  }
}

export const [getToggleGroupContext, setToggleGroupContext] = createContext<ToggleGroupState>();
