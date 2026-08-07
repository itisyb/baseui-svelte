import { createContext } from 'svelte';

export type CheckedState = boolean | 'indeterminate';

export class CheckboxState {
  checked = $state<CheckedState>(false);
  disabled = $state(false);
}

export const [getCheckboxContext, setCheckboxContext] = createContext<CheckboxState>();
