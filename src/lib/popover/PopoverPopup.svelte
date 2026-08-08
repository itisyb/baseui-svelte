<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js'; import { contains, getFocusable } from '../shared/dom.js'; import { getPopoverContext } from './popover-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; initialFocus?: HTMLElement | null; closeOnOutsidePress?: boolean; closeOnEscape?: boolean; ref?: HTMLDivElement | null; }
  let { children, initialFocus = null, closeOnOutsidePress = true, closeOnEscape = true, ref = $bindable(null), onkeydown, ...rest }: Props = $props(); const popover = getPopoverContext();
  function attach(node: HTMLDivElement) {
    popover.popup = node;
    queueMicrotask(() => (initialFocus ?? getFocusable(node)[0] ?? node).focus({ preventScroll: true }));
    const outside = (event: PointerEvent) => { if (closeOnOutsidePress && !contains(node, event.target) && !contains(popover.trigger, event.target)) popover.setOpen(false, 'outside-press', event); };
    document.addEventListener('pointerdown', outside, true);
    return () => { document.removeEventListener('pointerdown', outside, true); popover.popup = null; };
  }
  function keydown(event: KeyboardEvent) { if (event.key === 'Escape' && closeOnEscape) { event.preventDefault(); popover.setOpen(false, 'escape-key', event); popover.trigger?.focus(); } }
</script>
{#if popover.open}
  <div bind:this={ref} {...rest} id={popover.popupId} role="dialog" aria-labelledby={popover.titleMounted ? popover.titleId : undefined} aria-describedby={popover.descriptionMounted ? popover.descriptionId : undefined} tabindex="-1" data-open="" data-side={popover.side} data-align={popover.align} onkeydown={composeEventHandlers(onkeydown, keydown)} {@attach attach}>{@render children?.()}</div>
{/if}
