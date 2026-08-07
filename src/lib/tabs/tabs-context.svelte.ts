import { createContext, untrack } from 'svelte';
import type { Direction, Orientation } from '../shared/types.js';
import { moveRovingFocus } from '../shared/roving-focus.js';

export class TabsState {
  value = $state<string | null>(null);
  orientation = $state<Orientation>('horizontal');
  direction = $state<Direction>('ltr');
  loop = $state(true);
  activateOnFocus = $state(true);
  tabs = $state<HTMLElement[]>([]);
  baseId = $state('');
  select: (value: string, event: Event) => void = () => {};

  getTabId(value: string): string {
    return `${this.baseId}-tab-${value.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  }

  getPanelId(value: string): string {
    return `${this.baseId}-panel-${value.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
  }

  register(tab: HTMLElement): () => void {
    untrack(() => { this.tabs = [...this.tabs, tab]; });
    return () => { untrack(() => { this.tabs = this.tabs.filter((candidate) => candidate !== tab); }); };
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    const moved = moveRovingFocus({
      current: event.currentTarget,
      candidates: this.tabs,
      event,
      orientation: this.orientation,
      direction: this.direction,
      loop: this.loop,
    });
    if (moved && this.activateOnFocus) {
      const value = document.activeElement?.getAttribute('data-value');
      if (value) this.select(value, event);
    }
  }
}

export const [getTabsContext, setTabsContext] = createContext<TabsState>();
