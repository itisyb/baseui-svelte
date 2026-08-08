<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSliderContext } from './slider-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> { children?: Snippet<[number[]]>; ref?: HTMLSpanElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const slider = getSliderContext();
</script>
<span bind:this={ref} {...rest}>{#if children}{@render children(slider.values)}{:else}{slider.values.join(' – ')}{/if}</span>
