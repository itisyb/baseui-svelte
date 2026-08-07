<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getTabsContext } from './tabs-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLSpanElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getTabsContext();
</script>

<span bind:this={ref} {...rest} data-value={state.value ?? undefined} data-orientation={state.orientation}>
  {@render children?.()}
</span>
