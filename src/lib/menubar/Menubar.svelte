<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import type { Orientation } from '../shared/types.js'; import { moveRovingFocus } from '../shared/roving-focus.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; orientation?: Orientation; loopFocus?: boolean; modal?: boolean; disabled?: boolean; ref?: HTMLDivElement | null; }
  let { children, orientation = 'horizontal', loopFocus = true, modal = true, disabled = false, ref = $bindable(null), onkeydown, ...rest }: Props = $props();
  function key(event: KeyboardEvent) { onkeydown?.(event as KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }); if (event.defaultPrevented || !ref || !(event.target instanceof HTMLElement)) return; const candidates = Array.from(ref.querySelectorAll<HTMLElement>('button[aria-haspopup="menu"]')); moveRovingFocus({ current: event.target, candidates, event, orientation, loop: loopFocus }); }
</script>
<div bind:this={ref} {...rest} role="menubar" aria-orientation={orientation} aria-disabled={disabled || undefined} data-orientation={orientation} data-modal={modal ? '' : undefined} data-disabled={disabled ? '' : undefined} onkeydown={key}>{@render children?.()}</div>
