import { createContext, untrack } from 'svelte';

export interface MenuItemRecord { element: HTMLElement; disabled: boolean; text: string; }
export class MenuState {
  items = $state.raw<MenuItemRecord[]>([]);
  disabled = $state(false);
  register(item: MenuItemRecord): () => void { untrack(() => { this.items = [...this.items, item]; }); return () => untrack(() => { this.items = this.items.filter((candidate) => candidate !== item); }); }
  focus(delta: number, current?: HTMLElement) { const enabled = this.items.filter((item) => !item.disabled); if (!enabled.length) return; const index = current ? enabled.findIndex((item) => item.element === current) : -1; enabled[(index + delta + enabled.length) % enabled.length]?.element.focus(); }
}
export class MenuCheckboxState { checked = $state(false); }
export class MenuRadioGroupState { value = $state<string | null>(null); select: (value: string, event: Event) => void = () => {}; }
export class MenuRadioItemState { checked = $state(false); }
export const [getMenuContext, setMenuContext] = createContext<MenuState>();
export const [getMenuCheckboxContext, setMenuCheckboxContext] = createContext<MenuCheckboxState>();
export const [getMenuRadioGroupContext, setMenuRadioGroupContext] = createContext<MenuRadioGroupState>();
export const [getMenuRadioItemContext, setMenuRadioItemContext] = createContext<MenuRadioItemState>();

export class MenuHandle { open = $state(false); toggle() { this.open = !this.open; } close() { this.open = false; } }
export function createMenuHandle() { return new MenuHandle(); }
