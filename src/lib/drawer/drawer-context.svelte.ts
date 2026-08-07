import { createContext } from 'svelte';
export type DrawerSwipeDirection = 'up' | 'down' | 'left' | 'right';
export type DrawerSnapPoint = number | `${number}px` | `${number}rem`;
export class DrawerState { open = $state(false); swipeDirection = $state<DrawerSwipeDirection>('down'); swipeProgress = $state(0); snapPoints = $state.raw<DrawerSnapPoint[]>([]); snapPoint = $state<DrawerSnapPoint | null>(null); setOpen: (open: boolean, event: Event, reason: 'swipe' | 'trigger') => void = () => {}; setSnapPoint: (point: DrawerSnapPoint | null, event: Event) => void = () => {}; }
export const [getDrawerContext, setDrawerContext] = createContext<DrawerState>();
export class DrawerHandle<Payload = unknown> { open = $state(false); payload = $state<Payload | undefined>(); trigger(payload?: Payload) { this.payload = payload; this.open = true; } close() { this.open = false; } }
export function createDrawerHandle<Payload = unknown>() { return new DrawerHandle<Payload>(); }
