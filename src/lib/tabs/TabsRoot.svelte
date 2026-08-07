<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, OnValueChange, Orientation } from '../shared/types.js';
  import { setTabsContext, TabsState } from './tabs-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: string | null;
    onValueChange?: OnValueChange<string, 'tab-press' | 'keyboard'>;
    orientation?: Orientation;
    direction?: Direction;
    loop?: boolean;
    activateOnFocus?: boolean;
    ref?: HTMLDivElement | null;
  }
  let {
    children,
    value = $bindable(null),
    onValueChange,
    orientation = 'horizontal',
    direction = 'ltr',
    loop = true,
    activateOnFocus = true,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const state = setTabsContext(new TabsState());
  state.baseId = uid;
  state.select = (next, event) => {
    if (value === next) return;
    value = next;
    onValueChange?.(next, { reason: event instanceof KeyboardEvent ? 'keyboard' : 'tab-press', event });
  };
  $effect.pre(() => {
    state.value = value;
    state.orientation = orientation;
    state.direction = direction;
    state.loop = loop;
    state.activateOnFocus = activateOnFocus;
  });
</script>

<div bind:this={ref} {...rest} data-orientation={orientation}>
  {@render children?.()}
</div>
