<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import type { Orientation } from '../shared/types.js'; import { getScrollAreaContext } from './scroll-area-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; orientation?: Orientation; keepMounted?: boolean; ref?: HTMLDivElement | null; }
  let { children, orientation = 'vertical', keepMounted = false, ref = $bindable(null), ...rest }: Props = $props(); const area = getScrollAreaContext(); let visible = $derived(orientation === 'vertical' ? area.overflowY : area.overflowX);
  function page(event: PointerEvent) { if (!area.viewport || event.target !== event.currentTarget || !ref) return; const rect = ref.getBoundingClientRect(); const ratio = orientation === 'vertical' ? (event.clientY - rect.top) / rect.height : (event.clientX - rect.left) / rect.width; if (orientation === 'vertical') area.viewport.scrollTop = ratio * area.scrollHeight - area.clientHeight / 2; else area.viewport.scrollLeft = ratio * area.scrollWidth - area.clientWidth / 2; }
</script>
{#if keepMounted || visible}<div bind:this={ref} {...rest} role="presentation" hidden={!visible} data-orientation={orientation} data-scrolling={area.scrolling ? '' : undefined} onpointerdown={page}>{@render children?.()}</div>{/if}
