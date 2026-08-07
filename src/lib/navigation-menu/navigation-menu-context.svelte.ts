import { createContext } from 'svelte';
import type { Orientation } from '../shared/types.js';
export class NavigationMenuState { value = $state<string | null>(null); orientation = $state<Orientation>('horizontal'); baseId = $state(''); setValue: (value: string | null, event: Event) => void = () => {}; }
export class NavigationMenuItemState { value = $state(''); triggerId = $state(''); contentId = $state(''); }
export const [getNavigationMenuContext, setNavigationMenuContext] = createContext<NavigationMenuState>();
export const [getNavigationMenuItemContext, setNavigationMenuItemContext] = createContext<NavigationMenuItemState>();
