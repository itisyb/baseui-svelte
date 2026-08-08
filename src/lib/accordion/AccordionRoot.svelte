<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, OnValueChange, Orientation } from '../shared/types.js';
  import { AccordionState, type AccordionValue, setAccordionContext } from './accordion-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: AccordionValue;
    multiple?: boolean;
    disabled?: boolean;
    orientation?: Orientation;
    direction?: Direction;
    loop?: boolean;
    onValueChange?: OnValueChange<AccordionValue, 'trigger-press'>;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    value = $bindable(null),
    multiple = false,
    disabled = false,
    orientation = 'vertical',
    direction = 'ltr',
    loop = true,
    onValueChange,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const state = setAccordionContext(new AccordionState());
  state.toggle = (itemValue, event) => {
    const current = state.values;
    const nextValues = current.includes(itemValue)
      ? current.filter((candidate) => candidate !== itemValue)
      : multiple ? [...current, itemValue] : [itemValue];
    const nextValue: AccordionValue = multiple ? nextValues : (nextValues[0] ?? null);
    value = nextValue;
    onValueChange?.(nextValue, { reason: 'trigger-press', event });
  };

  $effect.pre(() => {
    state.values = Array.isArray(value) ? value : value === null ? [] : [value];
    state.multiple = multiple;
    state.disabled = disabled;
    state.orientation = orientation;
    state.direction = direction;
    state.loop = loop;
    state.element = ref;
  });
</script>

<div bind:this={ref} {...rest} data-orientation={orientation} data-disabled={disabled ? '' : undefined}>
  {@render children?.()}
</div>
