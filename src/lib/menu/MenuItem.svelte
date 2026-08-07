<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { composeEventHandlers } from '../shared/events.js'; import { getPopoverContext } from '../popover/popover-context.svelte.js'; import { getMenuContext, type MenuItemRecord } from './menu-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; disabled?: boolean; closeOnClick?: boolean; onSelect?: (event: Event) => void; textValue?: string; ref?: HTMLDivElement | null; }
  let { children, disabled = false, closeOnClick = true, onSelect, textValue = '', ref = $bindable(null), onclick, onpointermove, ...rest }: Props = $props(); const menu = getMenuContext(); const popover = getPopoverContext();
  $effect(() => { if (!ref) return; const item: MenuItemRecord = { element: ref, disabled, text: textValue || ref.textContent?.trim() || '' }; return menu.register(item); });
  function select(event: Event) { if (disabled || menu.disabled) return; onSelect?.(event); if (!event.defaultPrevented && closeOnClick) { popover.setOpen(false, 'close-press', event); popover.trigger?.focus(); } }
</script>
<div bind:this={ref} {...rest} role="menuitem" tabindex="-1" aria-disabled={disabled || menu.disabled || undefined} data-disabled={disabled || menu.disabled ? '' : undefined} onclick={composeEventHandlers(onclick, select)} onpointermove={composeEventHandlers(onpointermove, () => { if (!disabled) ref?.focus(); })}>{@render children?.()}</div>
