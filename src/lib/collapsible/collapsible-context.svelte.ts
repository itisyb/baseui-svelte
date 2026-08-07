import { createContext } from 'svelte';

export class CollapsibleState {
  open = $state(false);
  disabled = $state(false);
  triggerId = $state('');
  panelId = $state('');
  toggle: (event: Event) => void = () => {};
}

export const [getCollapsibleContext, setCollapsibleContext] = createContext<CollapsibleState>();
