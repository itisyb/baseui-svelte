<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLButtonAttributes } from 'svelte/elements'; import { composeEventHandlers } from '../shared/events.js'; import { getPopoverContext } from '../popover/popover-context.svelte.js'; import { getMenuContext } from './menu-context.svelte.js';
  interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; ref?: HTMLButtonElement | null; }
  let { children, ref = $bindable(null), disabled = false, onclick, onkeydown, ...rest }: Props = $props(); const popover = getPopoverContext(); const menu = getMenuContext(); $effect.pre(() => { popover.trigger = ref; });
  function keydown(event: KeyboardEvent) { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); popover.setOpen(true, 'trigger-press', event); queueMicrotask(() => menu.focus(event.key === 'ArrowDown' ? 1 : -1)); } }
</script>
<button bind:this={ref} {...rest} type="button" aria-haspopup="menu" aria-expanded={popover.open} aria-controls={popover.open ? popover.popupId : undefined} disabled={disabled || menu.disabled} data-popup-open={popover.open ? '' : undefined} onclick={composeEventHandlers(onclick, (event) => popover.setOpen(!popover.open, 'trigger-press', event))} onkeydown={composeEventHandlers(onkeydown, keydown)}>{@render children?.()}</button>
