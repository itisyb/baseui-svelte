<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { MeterState, setMeterContext } from './meter-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: number;
    min?: number;
    max?: number;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    value = 0,
    min = 0,
    max = 100,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  let normalized = $derived(Math.min(max, Math.max(min, value)));
  const uid = $props.id();
  const meter = setMeterContext(new MeterState());
  meter.labelId = `${uid}-label`;
  $effect.pre(() => { meter.value = normalized; meter.min = min; meter.max = max; });
</script>

<div
  bind:this={ref}
  {...rest}
  role="meter"
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuenow={normalized}
  aria-labelledby={meter.labelId}
  data-value={normalized}
>
  {@render children?.()}
</div>
