<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getTabsContext } from './tabs-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getTabsContext();
</script>

<div bind:this={ref} {...rest} role="tablist" aria-orientation={state.orientation} data-orientation={state.orientation}>
  {@render children?.()}
</div>
