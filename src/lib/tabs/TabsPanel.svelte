<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getTabsContext } from './tabs-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value: string;
    tabId?: string;
    keepMounted?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, value, tabId, keepMounted = false, ref = $bindable(null), ...rest }: Props = $props();
  const state = getTabsContext();
  let selected = $derived(state.value === value);
</script>

{#if keepMounted || selected}
  <div bind:this={ref} {...rest} id={state.getPanelId(value)} role="tabpanel" aria-labelledby={tabId ?? state.getTabId(value)} tabindex="0" hidden={!selected} data-selected={selected ? '' : undefined} data-unselected={!selected ? '' : undefined}>
    {@render children?.()}
  </div>
{/if}
