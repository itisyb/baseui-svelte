<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLButtonAttributes } from 'svelte/elements'; import { getPopoverContext } from '../popover/popover-context.svelte.js'; import { getTooltipProvider } from './tooltip-provider-context.svelte.js';
  export interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; delay?: number; closeDelay?: number; ref?: HTMLButtonElement | null; }
  let { children, delay, closeDelay, ref = $bindable(null), onpointerenter, onpointerleave, onfocus, onblur, ...rest }: Props = $props(); const tooltip = getPopoverContext(); const provider = getTooltipProvider();
  let timer: ReturnType<typeof setTimeout> | undefined;
  $effect.pre(() => { tooltip.trigger = ref; });
  function schedule(next: boolean, event: Event, wait: number) { clearTimeout(timer); timer = setTimeout(() => tooltip.setOpen(next, next ? 'trigger-press' : 'outside-press', event), wait); }
  function enter(event: PointerEvent) { onpointerenter?.(event as PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }); if (!event.defaultPrevented && event.pointerType !== 'touch') schedule(true, event, delay ?? provider?.delay ?? 600); }
  function leave(event: PointerEvent) { onpointerleave?.(event as PointerEvent & { currentTarget: EventTarget & HTMLButtonElement }); if (!event.defaultPrevented) schedule(false, event, closeDelay ?? provider?.closeDelay ?? 0); }
  function focus(event: FocusEvent) { onfocus?.(event as FocusEvent & { currentTarget: EventTarget & HTMLButtonElement }); if (!event.defaultPrevented) schedule(true, event, 0); }
  function blur(event: FocusEvent) { onblur?.(event as FocusEvent & { currentTarget: EventTarget & HTMLButtonElement }); if (!event.defaultPrevented) schedule(false, event, 0); }
</script>
<button bind:this={ref} {...rest} type="button" aria-describedby={tooltip.open ? tooltip.popupId : undefined} data-popup-open={tooltip.open ? '' : undefined} onpointerenter={enter} onpointerleave={leave} onfocus={focus} onblur={blur}>{@render children?.()}</button>
