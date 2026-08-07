<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getRadioGroupContext } from '../radio-group/radio-group-context.svelte.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    children?: Snippet;
    value: string;
    ref?: HTMLButtonElement | null;
  }
  let { children, value, disabled = false, ref = $bindable(null), onclick, onkeydown, ...rest }: Props = $props();
  const group = getRadioGroupContext();
  let checked = $derived(group.value === value);
  let isDisabled = $derived(group.disabled || !!disabled);
  let tabIndex = $derived(checked || (group.value === null && group.items[0] === ref) ? 0 : -1);

  $effect(() => {
    if (!ref) return;
    return group.register(ref);
  });
</script>

<button
  bind:this={ref}
  {...rest}
  type="button"
  role="radio"
  aria-checked={checked}
  disabled={isDisabled}
  tabindex={tabIndex}
  data-value={value}
  data-checked={checked ? '' : undefined}
  data-unchecked={!checked ? '' : undefined}
  data-disabled={isDisabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, (event) => group.select(value, event))}
  onkeydown={composeEventHandlers(onkeydown, (event) => group.handleKeydown(event))}
>
  {@render children?.()}
</button>
{#if group.name}
  <input aria-hidden="true" tabindex="-1" type="radio" name={group.name} {value} checked={checked} disabled={isDisabled} required={group.required} style="position:absolute;pointer-events:none;opacity:0;margin:0" />
{/if}
