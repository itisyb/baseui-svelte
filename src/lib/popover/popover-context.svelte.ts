import { createContext } from 'svelte';

export type PopoverOpenReason = 'trigger-press' | 'close-press' | 'outside-press' | 'escape-key';

export class PopoverState {
  open = $state(false);
  trigger = $state<HTMLElement | null>(null);
  positioner = $state<HTMLDivElement | null>(null);
  popup = $state<HTMLDivElement | null>(null);
  arrow = $state<HTMLElement | null>(null);
  popupId = $state('');
  titleId = $state('');
  descriptionId = $state('');
  titleMounted = $state(false);
  descriptionMounted = $state(false);
  side = $state<'top' | 'right' | 'bottom' | 'left'>('bottom');
  align = $state<'start' | 'center' | 'end'>('center');
  arrowX = $state<number | undefined>();
  arrowY = $state<number | undefined>();
  setOpen: (open: boolean, reason: PopoverOpenReason, event: Event) => void = () => {};
}

export const [getPopoverContext, setPopoverContext] = createContext<PopoverState>();
