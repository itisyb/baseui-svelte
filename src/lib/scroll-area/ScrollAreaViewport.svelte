<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getScrollAreaContext } from './scroll-area-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), onscroll, style, ...rest }: Props = $props(); const area = getScrollAreaContext(); let timer: ReturnType<typeof setTimeout>;
  $effect.pre(() => { area.viewport = ref; });
  function attach(node: HTMLDivElement) { const observer = new ResizeObserver(() => area.update()); observer.observe(node); if (node.firstElementChild) observer.observe(node.firstElementChild); area.update(); return () => observer.disconnect(); }
  function scroll(event: UIEvent) { onscroll?.(event as UIEvent & { currentTarget: EventTarget & HTMLDivElement }); area.scrolling = true; area.update(); clearTimeout(timer); timer = setTimeout(() => { area.scrolling = false; }, 120); }
  let viewportStyle = $derived(`overflow:scroll;scrollbar-width:none;${typeof style === 'string' ? style : ''}`);
</script>
<div bind:this={ref} {...rest} style={viewportStyle} data-scrolling={area.scrolling ? '' : undefined} onscroll={scroll} {@attach attach}>{@render children?.()}</div>
