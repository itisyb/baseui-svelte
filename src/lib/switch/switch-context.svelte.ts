import { createContext } from 'svelte';

export class SwitchState {
  checked = $state(false);
  disabled = $state(false);
}

export const [getSwitchContext, setSwitchContext] = createContext<SwitchState>();
