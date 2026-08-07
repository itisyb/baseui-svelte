import { createContext, untrack } from 'svelte';
import type { Direction, Orientation } from '../shared/types.js';
import { moveRovingFocus } from '../shared/roving-focus.js';

export class RadioGroupState {
  value = $state<string | null>(null);
  disabled = $state(false);
  required = $state(false);
  name = $state<string | undefined>();
  orientation = $state<Orientation>('vertical');
  direction = $state<Direction>('ltr');
  loop = $state(true);
  items = $state<HTMLElement[]>([]);
  select: (value: string, event: Event) => void = () => {};

  register(item: HTMLElement): () => void {
    untrack(() => { this.items = [...this.items, item]; });
    return () => { untrack(() => { this.items = this.items.filter((candidate) => candidate !== item); }); };
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    const moved = moveRovingFocus({
      current: event.currentTarget,
      candidates: this.items,
      event,
      orientation: this.orientation,
      direction: this.direction,
      loop: this.loop,
    });
    if (moved) {
      const selected = document.activeElement?.getAttribute('data-value');
      if (selected) this.select(selected, event);
    }
  }
}

export const [getRadioGroupContext, setRadioGroupContext] = createContext<RadioGroupState>();
