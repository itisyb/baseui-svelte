<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, OnValueChange, Orientation } from '../shared/types.js';
  import { snapToStep } from '../number-field/number-field-context.svelte.js';
  import { setSliderContext, SliderState, type SliderChangeReason, type SliderValue } from './slider-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: SliderValue;
    onValueChange?: OnValueChange<SliderValue, SliderChangeReason>;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    orientation?: Orientation;
    direction?: Direction;
    name?: string;
    ref?: HTMLDivElement | null;
  }
  let {
    children,
    value = $bindable(0),
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = 'horizontal',
    direction = 'ltr',
    name,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const slider = setSliderContext(new SliderState());
  slider.labelId = `${uid}-label`;
  slider.setValueAt = (index, rawValue, reason, event) => {
    if (disabled) return;
    const next = Math.min(max, Math.max(min, snapToStep(rawValue, min, step)));
    const nextValues = [...slider.values];
    const lower = index > 0 ? nextValues[index - 1] : min;
    const upper = index < nextValues.length - 1 ? nextValues[index + 1] : max;
    nextValues[index] = Math.max(lower, Math.min(upper, next));
    const output: SliderValue = Array.isArray(value) ? nextValues : nextValues[0];
    value = output;
    onValueChange?.(output, { reason, event });
  };
  $effect.pre(() => {
    slider.values = (Array.isArray(value) ? value : [value]).map((item) => Math.min(max, Math.max(min, item)));
    slider.min = min;
    slider.max = max;
    slider.step = step > 0 ? step : 1;
    slider.disabled = disabled;
    slider.orientation = orientation;
    slider.direction = direction;
    slider.name = name;
  });
</script>

<div bind:this={ref} {...rest} data-orientation={orientation} data-disabled={disabled ? '' : undefined} style:--slider-start={`${slider.percentage(slider.values[0])}%`} style:--slider-end={`${slider.percentage(slider.values[slider.values.length - 1])}%`}>
  {@render children?.()}
</div>
