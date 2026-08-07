import { createContext, untrack } from 'svelte';

export interface SelectItemRecord { value: string; label: string; disabled: boolean; element: HTMLElement | null; }
export class SelectItemState implements SelectItemRecord {
  value = $state('');
  label = $state('');
  disabled = $state(false);
  element = $state<HTMLElement | null>(null);
}
export class SelectState {
  value = $state<string | null>(null);
  disabled = $state(false);
  required = $state(false);
  name = $state<string | undefined>();
  items = $state.raw<SelectItemRecord[]>([]);
  labels = $state<Record<string, string>>({});
  highlighted = $state<string | null>(null);
  labelId = $state('');
  triggerId = $state('');
  listId = $state('');
  select: (value: string, event: Event) => void = () => {};
  register(item: SelectItemRecord): () => void { untrack(() => { this.items = [...this.items, item]; this.labels = { ...this.labels, [item.value]: item.label }; }); return () => untrack(() => { this.items = this.items.filter((candidate) => candidate !== item); }); }
  get selectedItem() { return this.items.find((item) => item.value === this.value); }
  get selectedLabel() { return this.value === null ? undefined : this.selectedItem?.label ?? this.labels[this.value]; }
  moveHighlight(delta: number) { const enabled = this.items.filter((item) => !item.disabled); if (!enabled.length) return; const index = enabled.findIndex((item) => item.value === this.highlighted); const next = enabled[(Math.max(0, index) + delta + enabled.length) % enabled.length]; this.highlighted = next.value; next.element?.focus(); }
}
export const [getSelectContext, setSelectContext] = createContext<SelectState>();
export const [getSelectItemContext, setSelectItemContext] = createContext<SelectItemState>();
