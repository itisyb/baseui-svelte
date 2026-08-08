<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getAccordionContext, getAccordionItemContext } from './accordion-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    keepMounted?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, keepMounted = false, ref = $bindable(null), ...rest }: Props = $props();
  const root = getAccordionContext();
  const item = getAccordionItemContext();
  let open = $derived(root.isOpen(item.value));
</script>

{#if keepMounted || open}
  <div bind:this={ref} {...rest} id={item.panelId} role="region" aria-labelledby={item.triggerId} hidden={!open} data-open={open ? '' : undefined} data-closed={!open ? '' : undefined}>
    {@render children?.()}
  </div>
{/if}
