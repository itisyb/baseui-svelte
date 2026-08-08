<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { ScrollAreaState, setScrollAreaContext } from './scroll-area-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const area = setScrollAreaContext(new ScrollAreaState());
</script>
<div bind:this={ref} {...rest} data-scrolling={area.scrolling ? '' : undefined} data-overflow-x={area.overflowX ? '' : undefined} data-overflow-y={area.overflowY ? '' : undefined}>{@render children?.()}</div>
