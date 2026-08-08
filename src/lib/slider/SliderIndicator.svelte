<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSliderContext } from './slider-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const slider = getSliderContext();
  let start = $derived(slider.values.length > 1 ? slider.percentage(slider.values[0]) : 0);
  let end = $derived(slider.percentage(slider.values[slider.values.length - 1]));
</script>
<div bind:this={ref} {...rest} data-orientation={slider.orientation} style:--slider-indicator-start={`${start}%`} style:--slider-indicator-end={`${end}%`}>{@render children?.()}</div>
