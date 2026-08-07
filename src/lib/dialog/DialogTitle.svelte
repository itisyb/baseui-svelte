<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onDestroy } from 'svelte';
  import { getDialogContext } from './dialog-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLHeadingElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getDialogContext();
  state.titleMounted = true;
  onDestroy(() => { state.titleMounted = false; });
</script>

<h2 bind:this={ref} {...rest} id={state.titleId}>
  {@render children?.()}
</h2>
