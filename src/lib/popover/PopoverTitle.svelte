<script lang="ts">
  import { onDestroy } from 'svelte'; import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from './popover-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> { children?: Snippet; ref?: HTMLHeadingElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const popover = getPopoverContext(); popover.titleMounted = true; onDestroy(() => { popover.titleMounted = false; });
</script>
<h2 bind:this={ref} {...rest} id={popover.titleId}>{@render children?.()}</h2>
