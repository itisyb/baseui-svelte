<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getToggleGroupContext } from './toggle-group-context.svelte.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    children?: Snippet;
    value: string;
    ref?: HTMLButtonElement | null;
  }
  let { children, value, disabled = false, ref = $bindable(null), onclick, onkeydown, ...rest }: Props = $props();
  const state = getToggleGroupContext();
  let pressed = $derived(state.values.includes(value));
  let isDisabled = $derived(state.disabled || !!disabled);

  $effect(() => {
    if (!ref) return;
    return state.register(ref);
  });
</script>

<button
  bind:this={ref}
  {...rest}
  type="button"
  aria-pressed={pressed}
  disabled={isDisabled}
  tabindex={state.items[0] === ref ? 0 : -1}
  data-value={value}
  data-pressed={pressed ? '' : undefined}
  data-unpressed={!pressed ? '' : undefined}
  data-disabled={isDisabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, (event) => { if (!isDisabled) state.toggle(value, event); })}
  onkeydown={composeEventHandlers(onkeydown, (event) => state.handleKeydown(event))}
>
  {@render children?.()}
</button>
