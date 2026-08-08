<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getDialogContext } from './dialog-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    keepMounted?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, keepMounted = false, ref = $bindable(null), ...rest }: Props = $props();
  const state = getDialogContext();
</script>

{#if keepMounted || state.open}
  <div bind:this={ref} {...rest} aria-hidden="true" hidden={!state.open} data-open={state.open ? '' : undefined} data-closed={!state.open ? '' : undefined}>
    {@render children?.()}
  </div>
{/if}
