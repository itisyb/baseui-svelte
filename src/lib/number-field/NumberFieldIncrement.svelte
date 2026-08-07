<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getNumberFieldContext } from './number-field-context.svelte.js';
  interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; ref?: HTMLButtonElement | null; }
  let { children, ref = $bindable(null), onclick, ...rest }: Props = $props();
  const numberField = getNumberFieldContext();
</script>

<button bind:this={ref} {...rest} type="button" aria-label="Increase" aria-controls={numberField.inputId} disabled={numberField.disabled || numberField.readOnly || (numberField.value !== null && numberField.value >= numberField.max)} onclick={composeEventHandlers(onclick, (event) => numberField.stepBy(1, 'increment', event))}>
  {@render children?.()}
</button>
