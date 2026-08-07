<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from './popover-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const popover = getPopoverContext();
</script>
{#if popover.open}<div bind:this={ref} {...rest} aria-hidden="true" data-open="">{@render children?.()}</div>{/if}
