<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getSliderContext } from './slider-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    index?: number;
    getAriaValueText?: (value: number, index: number) => string;
    ref?: HTMLDivElement | null;
  }
  let { children, index = 0, getAriaValueText, ref = $bindable(null), onkeydown, ...rest }: Props = $props();
  const slider = getSliderContext();
  let current = $derived(slider.values[index] ?? slider.min);
  let position = $derived(slider.percentage(current));
  function handleKeydown(event: KeyboardEvent) {
    let delta = 0;
    const decrease = slider.orientation === 'horizontal' && slider.direction === 'rtl' ? 'ArrowRight' : slider.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowDown';
    const increase = slider.orientation === 'horizontal' && slider.direction === 'rtl' ? 'ArrowLeft' : slider.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowUp';
    if (event.key === decrease) delta = -slider.step;
    if (event.key === increase) delta = slider.step;
    if (event.key === 'PageDown') delta = -slider.step * 10;
    if (event.key === 'PageUp') delta = slider.step * 10;
    if (event.key === 'Home') { event.preventDefault(); slider.setValueAt(index, slider.min, 'keyboard', event); return; }
    if (event.key === 'End') { event.preventDefault(); slider.setValueAt(index, slider.max, 'keyboard', event); return; }
    if (delta) { event.preventDefault(); slider.setValueAt(index, current + delta, 'keyboard', event); }
  }
</script>

<div
  bind:this={ref}
  {...rest}
  role="slider"
  tabindex={slider.disabled ? undefined : 0}
  aria-valuemin={slider.min}
  aria-valuemax={slider.max}
  aria-valuenow={current}
  aria-valuetext={getAriaValueText?.(current, index)}
  aria-orientation={slider.orientation}
  aria-labelledby={slider.labelId}
  aria-disabled={slider.disabled || undefined}
  data-orientation={slider.orientation}
  data-index={index}
  data-disabled={slider.disabled ? '' : undefined}
  style:--slider-thumb-position={`${position}%`}
  onkeydown={composeEventHandlers(onkeydown, handleKeydown)}
>
  {@render children?.()}
</div>
{#if slider.name}
  <input type="hidden" name={slider.values.length > 1 ? `${slider.name}[]` : slider.name} value={current} />
{/if}
