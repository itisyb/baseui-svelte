import { createContext, untrack } from 'svelte';

export type ComboboxValue = unknown | unknown[] | null;
export type ComboboxChangeReason = 'item-press' | 'keyboard' | 'clear' | 'chip-remove';
export interface ComboboxItemRecord { id: string; value: unknown; label: string; disabled: boolean; element: HTMLElement | null; }
export class ComboboxItemState implements ComboboxItemRecord { id = $state(''); value = $state<unknown>(); label = $state(''); disabled = $state(false); element = $state<HTMLElement | null>(null); }
export class ComboboxChipState { value = $state<unknown>(); }
export class ComboboxState {
  value = $state<ComboboxValue>(null);
  inputValue = $state('');
  multiple = $state(false);
  disabled = $state(false);
  readOnly = $state(false);
  required = $state(false);
  name = $state<string | undefined>();
  inputId = $state('');
  listId = $state('');
  labelId = $state('');
  items = $state.raw<ComboboxItemRecord[]>([]);
  sourceItems = $state.raw<unknown[]>([]);
  highlightedId = $state<string | null>(null);
  input = $state<HTMLInputElement | null>(null);
  itemToString: (item: unknown) => string = (item) => String(item ?? '');
  isItemEqual: (a: unknown, b: unknown) => boolean = Object.is;
  filter: (item: unknown, query: string) => boolean = (item, query) => this.itemToString(item).toLocaleLowerCase().includes(query.toLocaleLowerCase());
  select: (value: unknown, reason: ComboboxChangeReason, event: Event) => void = () => {};
  setInputValue: (value: string, event: Event) => void = () => {};
  clear: (event: Event) => void = () => {};

  register(item: ComboboxItemRecord): () => void { untrack(() => { this.items = [...this.items, item]; }); return () => untrack(() => { this.items = this.items.filter((candidate) => candidate !== item); }); }
  get selectedValues(): unknown[] { return Array.isArray(this.value) ? this.value : this.value == null ? [] : [this.value]; }
  isSelected(value: unknown): boolean { return this.selectedValues.some((item) => this.isItemEqual(item, value)); }
  get visibleItems(): ComboboxItemRecord[] { return this.items.filter((item) => !item.disabled && this.filter(item.value, this.inputValue)); }
  move(delta: number): void { const items = this.visibleItems; if (!items.length) return; const index = items.findIndex((item) => item.id === this.highlightedId); this.highlightedId = items[(Math.max(0, index) + delta + items.length) % items.length].id; }
  get highlightedItem(): ComboboxItemRecord | undefined { return this.items.find((item) => item.id === this.highlightedId); }
  labelFor(value: unknown): string { return this.items.find((item) => this.isItemEqual(item.value, value))?.label ?? this.itemToString(value); }
}
export const [getComboboxContext, setComboboxContext] = createContext<ComboboxState>();
export const [getComboboxItemContext, setComboboxItemContext] = createContext<ComboboxItemState>();
export const [getComboboxChipContext, setComboboxChipContext] = createContext<ComboboxChipState>();
