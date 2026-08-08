<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { AccordionItemState, getAccordionContext, setAccordionItemContext } from './accordion-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value: string;
    disabled?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, value, disabled = false, ref = $bindable(null), ...rest }: Props = $props();
  const root = getAccordionContext();
  const uid = $props.id();
  const item = setAccordionItemContext(new AccordionItemState());
  item.triggerId = `${uid}-trigger`;
  item.panelId = `${uid}-panel`;
  $effect.pre(() => {
    item.value = value;
    item.disabled = disabled;
  });
  let open = $derived(root.isOpen(value));
</script>

<div bind:this={ref} {...rest} data-open={open ? '' : undefined} data-closed={!open ? '' : undefined} data-disabled={disabled || root.disabled ? '' : undefined}>
  {@render children?.()}
</div>
