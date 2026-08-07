<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getNumberFieldContext } from './number-field-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const numberField = getNumberFieldContext();
</script>

<div bind:this={ref} {...rest} role="group" data-disabled={numberField.disabled ? '' : undefined} data-readonly={numberField.readOnly ? '' : undefined}>
  {@render children?.()}
</div>
