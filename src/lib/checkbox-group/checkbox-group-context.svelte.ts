import { getContext, setContext } from 'svelte';

const CHECKBOX_GROUP_CONTEXT = Symbol('base-ui-checkbox-group');

export class CheckboxGroupState {
  values = $state<string[]>([]);
  disabled = $state(false);
  name = $state<string | undefined>();
  toggle: (value: string, event: Event) => void = () => {};
}

export function setCheckboxGroupContext(state: CheckboxGroupState): CheckboxGroupState {
  setContext(CHECKBOX_GROUP_CONTEXT, state);
  return state;
}

export function getCheckboxGroupContext(): CheckboxGroupState | undefined {
  return getContext<CheckboxGroupState | undefined>(CHECKBOX_GROUP_CONTEXT);
}
