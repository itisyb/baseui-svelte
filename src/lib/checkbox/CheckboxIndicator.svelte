<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getCheckboxContext } from './checkbox-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    keepMounted?: boolean;
    ref?: HTMLSpanElement | null;
  }
  let { children, keepMounted = false, ref = $bindable(null), ...rest }: Props = $props();
  const state = getCheckboxContext();
  let visible = $derived(state.checked !== false);
</script>

{#if keepMounted || visible}
  <span bind:this={ref} {...rest} hidden={!visible} data-checked={state.checked === true ? '' : undefined} data-indeterminate={state.checked === 'indeterminate' ? '' : undefined}>
    {@render children?.()}
  </span>
{/if}
