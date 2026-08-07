<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSliderContext } from './slider-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> { children?: Snippet; ref?: HTMLSpanElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const slider = getSliderContext();
</script>
<span bind:this={ref} {...rest} id={slider.labelId}>{@render children?.()}</span>
