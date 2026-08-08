<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getScrollAreaContext } from './scroll-area-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const area = getScrollAreaContext();
</script>
{#if area.overflowX && area.overflowY}<div bind:this={ref} {...rest}>{@render children?.()}</div>{/if}
