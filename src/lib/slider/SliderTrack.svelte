<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSliderContext } from './slider-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const slider = getSliderContext();
</script>
<div bind:this={ref} {...rest} data-orientation={slider.orientation} data-disabled={slider.disabled ? '' : undefined}>{@render children?.()}</div>
