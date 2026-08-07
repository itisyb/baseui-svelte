<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from '../popover/popover-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; disabled?: boolean; ref?: HTMLDivElement | null; }
  let { children, disabled = false, ref = $bindable(null), oncontextmenu, onkeydown, ...rest }: Props = $props(); const menu = getPopoverContext(); let anchor: HTMLSpanElement | null = null;
  function openAt(x: number, y: number, event: Event) { if (disabled) return; anchor?.remove(); anchor = document.createElement('span'); Object.assign(anchor.style, { position: 'fixed', left: `${x}px`, top: `${y}px`, width: '0px', height: '0px' }); document.body.append(anchor); menu.trigger = anchor; menu.setOpen(true, 'trigger-press', event); }
  function context(event: MouseEvent) { oncontextmenu?.(event as MouseEvent & { currentTarget: EventTarget & HTMLDivElement }); if (!event.defaultPrevented && !disabled) { event.preventDefault(); openAt(event.clientX, event.clientY, event); } }
  function key(event: KeyboardEvent) { onkeydown?.(event as KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }); if (!event.defaultPrevented && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) && ref) { event.preventDefault(); const rect = ref.getBoundingClientRect(); openAt(rect.left, rect.bottom, event); } }
  $effect(() => () => anchor?.remove());
</script>
<div bind:this={ref} {...rest} data-popup-open={menu.open ? '' : undefined} data-disabled={disabled ? '' : undefined} oncontextmenu={context} onkeydown={key}>{@render children?.()}</div>
