<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getAccordionContext, getAccordionItemContext } from './accordion-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    level?: number;
    ref?: HTMLDivElement | null;
  }
  let { children, level = 3, ref = $bindable(null), ...rest }: Props = $props();
  const root = getAccordionContext();
  const item = getAccordionItemContext();
  let open = $derived(root.isOpen(item.value));
</script>

<div bind:this={ref} {...rest} role="heading" aria-level={level} data-open={open ? '' : undefined} data-closed={!open ? '' : undefined}>
  {@render children?.()}
</div>
