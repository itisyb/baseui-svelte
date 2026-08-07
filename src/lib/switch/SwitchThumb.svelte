<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSwitchContext } from './switch-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLSpanElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getSwitchContext();
</script>

<span bind:this={ref} {...rest} data-checked={state.checked ? '' : undefined} data-unchecked={!state.checked ? '' : undefined} data-disabled={state.disabled ? '' : undefined}>
  {@render children?.()}
</span>
