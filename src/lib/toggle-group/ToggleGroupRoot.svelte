<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, OnValueChange, Orientation } from '../shared/types.js';
  import { setToggleGroupContext, ToggleGroupState, type ToggleGroupValue } from './toggle-group-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: ToggleGroupValue;
    multiple?: boolean;
    onValueChange?: OnValueChange<ToggleGroupValue, 'item-press'>;
    disabled?: boolean;
    orientation?: Orientation;
    direction?: Direction;
    loop?: boolean;
    ref?: HTMLDivElement | null;
  }
  let {
    children,
    value = $bindable(null),
    multiple = false,
    onValueChange,
    disabled = false,
    orientation = 'horizontal',
    direction = 'ltr',
    loop = true,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const state = setToggleGroupContext(new ToggleGroupState());
  state.toggle = (itemValue, event) => {
    if (disabled) return;
    const nextValues = state.values.includes(itemValue)
      ? state.values.filter((candidate) => candidate !== itemValue)
      : multiple ? [...state.values, itemValue] : [itemValue];
    const next: ToggleGroupValue = multiple ? nextValues : (nextValues[0] ?? null);
    value = next;
    onValueChange?.(next, { reason: 'item-press', event });
  };
  $effect.pre(() => {
    state.values = Array.isArray(value) ? value : value === null ? [] : [value];
    state.multiple = multiple;
    state.disabled = disabled;
    state.orientation = orientation;
    state.direction = direction;
    state.loop = loop;
  });
</script>

<div bind:this={ref} {...rest} role="group" data-orientation={orientation} data-disabled={disabled ? '' : undefined}>
  {@render children?.()}
</div>
