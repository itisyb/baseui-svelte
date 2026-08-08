<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getAccordionContext, getAccordionItemContext } from './accordion-context.svelte.js';

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet;
    ref?: HTMLButtonElement | null;
  }
  let { children, ref = $bindable(null), onclick, onkeydown, ...rest }: Props = $props();
  const root = getAccordionContext();
  const item = getAccordionItemContext();
  let open = $derived(root.isOpen(item.value));
  let disabled = $derived(root.disabled || item.disabled);

  function activate(event: MouseEvent) {
    if (!disabled) root.toggle(item.value, event);
  }
</script>

<button
  bind:this={ref}
  {...rest}
  id={item.triggerId}
  type="button"
  aria-controls={item.panelId}
  aria-expanded={open}
  {disabled}
  data-base-ui-accordion-trigger=""
  data-open={open ? '' : undefined}
  data-closed={!open ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, activate)}
  onkeydown={composeEventHandlers(onkeydown, (event) => root.handleKeydown(event))}
>
  {@render children?.()}
</button>
