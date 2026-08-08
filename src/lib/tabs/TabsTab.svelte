<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getTabsContext } from './tabs-context.svelte.js';

  export interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    children?: Snippet;
    value: string;
    ref?: HTMLButtonElement | null;
  }
  let { children, value, disabled = false, id, ref = $bindable(null), onclick, onkeydown, ...rest }: Props = $props();
  const state = getTabsContext();
  let selected = $derived(state.value === value);
  let tabId = $derived(id ?? state.getTabId(value));

  $effect(() => {
    if (!ref) return;
    return state.register(ref);
  });
</script>

<button
  bind:this={ref}
  {...rest}
  id={tabId}
  type="button"
  role="tab"
  aria-selected={selected}
  aria-controls={state.getPanelId(value)}
  tabindex={selected ? 0 : -1}
  {disabled}
  data-value={value}
  data-selected={selected ? '' : undefined}
  data-unselected={!selected ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, (event) => { if (!disabled) state.select(value, event); })}
  onkeydown={composeEventHandlers(onkeydown, (event) => state.handleKeydown(event))}
>
  {@render children?.()}
</button>
