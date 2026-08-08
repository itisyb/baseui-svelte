<script lang="ts">
  import { onDestroy } from 'svelte'; import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from './popover-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> { children?: Snippet; ref?: HTMLParagraphElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const popover = getPopoverContext(); popover.descriptionMounted = true; onDestroy(() => { popover.descriptionMounted = false; });
</script>
<p bind:this={ref} {...rest} id={popover.descriptionId}>{@render children?.()}</p>
