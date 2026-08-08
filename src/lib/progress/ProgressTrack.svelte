<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getProgressContext } from './progress-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  }

  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getProgressContext();
</script>

<div bind:this={ref} {...rest} data-status={state.status}>
  {@render children?.()}
</div>
