<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getCollapsibleContext } from './collapsible-context.svelte.js';

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet;
    ref?: HTMLButtonElement | null;
  }
  let { children, ref = $bindable(null), onclick, ...rest }: Props = $props();
  const state = getCollapsibleContext();
</script>

<button bind:this={ref} {...rest} id={state.triggerId} type="button" aria-controls={state.panelId} aria-expanded={state.open} disabled={state.disabled} data-open={state.open ? '' : undefined} data-closed={!state.open ? '' : undefined} data-disabled={state.disabled ? '' : undefined} onclick={composeEventHandlers(onclick, state.toggle)}>
  {@render children?.()}
</button>
