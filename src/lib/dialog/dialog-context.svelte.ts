import { createContext } from 'svelte';

export type DialogOpenReason = 'trigger-press' | 'close-press' | 'outside-press' | 'escape-key';

export class DialogState {
  open = $state(false);
  modal = $state(true);
  trigger = $state<HTMLButtonElement | null>(null);
  popup = $state<HTMLDivElement | null>(null);
  titleMounted = $state(false);
  descriptionMounted = $state(false);
  popupId = $state('');
  titleId = $state('');
  descriptionId = $state('');
  setOpen: (open: boolean, reason: DialogOpenReason, event: Event) => void = () => {};
}

export const [getDialogContext, setDialogContext] = createContext<DialogState>();
