<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, OnValueChange, Orientation } from '../shared/types.js';
  import { RadioGroupState, setRadioGroupContext } from './radio-group-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: string | null;
    onValueChange?: OnValueChange<string, 'item-press' | 'keyboard'>;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    orientation?: Orientation;
    direction?: Direction;
    loop?: boolean;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    value = $bindable(null),
    onValueChange,
    name,
    disabled = false,
    required = false,
    orientation = 'vertical',
    direction = 'ltr',
    loop = true,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const state = setRadioGroupContext(new RadioGroupState());
  state.select = (next, event) => {
    if (disabled || value === next) return;
    value = next;
    onValueChange?.(next, { reason: event instanceof KeyboardEvent ? 'keyboard' : 'item-press', event });
  };
  $effect.pre(() => {
    state.value = value;
    state.name = name;
    state.disabled = disabled;
    state.required = required;
    state.orientation = orientation;
    state.direction = direction;
    state.loop = loop;
  });
</script>

<div bind:this={ref} {...rest} role="radiogroup" aria-orientation={orientation} aria-required={required || undefined} data-orientation={orientation} data-disabled={disabled ? '' : undefined}>
  {@render children?.()}
</div>
