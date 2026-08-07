<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onDestroy } from 'svelte';
  import { getDialogContext } from './dialog-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLParagraphElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getDialogContext();
  state.descriptionMounted = true;
  onDestroy(() => { state.descriptionMounted = false; });
</script>

<p bind:this={ref} {...rest} id={state.descriptionId}>
  {@render children?.()}
</p>
