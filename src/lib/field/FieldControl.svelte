<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getFieldContext } from './field-context.svelte.js';

  export interface Props extends HTMLInputAttributes {
    value?: string | number | readonly string[] | null;
    ref?: HTMLInputElement | null;
  }
  let { value = $bindable(), ref = $bindable(null), oninput, onblur, ...rest }: Props = $props();
  const state = getFieldContext();

  function handleInput(event: Event) {
    state.dirty = true;
    state.updateValidity(event.currentTarget as HTMLInputElement);
  }
  function handleBlur(event: FocusEvent) {
    state.touched = true;
    state.updateValidity(event.currentTarget as HTMLInputElement);
  }
</script>

<input
  bind:this={ref}
  bind:value
  {...rest}
  id={state.controlId}
  name={state.name}
  disabled={state.disabled}
  required={state.required}
  aria-invalid={state.invalid || undefined}
  aria-describedby={state.describedBy}
  data-disabled={state.disabled ? '' : undefined}
  data-invalid={state.invalid ? '' : undefined}
  oninput={composeEventHandlers(oninput, handleInput)}
  onblur={composeEventHandlers(onblur, handleBlur)}
/>
