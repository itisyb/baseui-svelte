<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { getFieldContext } from './field-context.svelte.js';

  export interface Props extends Omit<HTMLLabelAttributes, 'children'> {
    children?: Snippet;
    ref?: HTMLLabelElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getFieldContext();
</script>

<label bind:this={ref} {...rest} id={state.labelId} for={state.controlId} data-disabled={state.disabled ? '' : undefined} data-invalid={state.invalid ? '' : undefined}>
  {@render children?.()}
</label>
