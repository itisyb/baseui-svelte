<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from './popover-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), style, ...rest }: Props = $props(); const popover = getPopoverContext();
  $effect.pre(() => { popover.arrow = ref; });
  let arrowStyle = $derived(`position:absolute;left:${popover.arrowX == null ? '' : `${popover.arrowX}px`};top:${popover.arrowY == null ? '' : `${popover.arrowY}px`};${typeof style === 'string' ? style : ''}`);
</script>
<div bind:this={ref} {...rest} style={arrowStyle} data-side={popover.side}>{@render children?.()}</div>
