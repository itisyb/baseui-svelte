<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { composeEventHandlers } from '../shared/events.js';
  import { CheckboxState, type CheckedState, setCheckboxContext } from './checkbox-context.svelte.js';
  import { getCheckboxGroupContext } from '../checkbox-group/checkbox-group-context.svelte.js';

  type CheckboxReason = 'trigger-press';
  export interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    children?: Snippet;
    checked?: CheckedState;
    onCheckedChange?: OnValueChange<CheckedState, CheckboxReason>;
    name?: string;
    value?: string;
    required?: boolean;
    ref?: HTMLButtonElement | null;
  }

  let {
    children,
    checked = $bindable(false),
    onCheckedChange,
    disabled = false,
    name,
    value = 'on',
    required = false,
    ref = $bindable(null),
    onclick,
    ...rest
  }: Props = $props();

  const state = setCheckboxContext(new CheckboxState());
  const group = getCheckboxGroupContext();
  let currentChecked = $derived(group ? group.values.includes(value) : checked);
  let currentDisabled = $derived(!!disabled || !!group?.disabled);
  let currentName = $derived(group?.name ?? name);
  $effect.pre(() => {
    state.checked = currentChecked;
    state.disabled = currentDisabled;
  });

  function toggle(event: MouseEvent) {
    if (currentDisabled) return;
    if (group) {
      group.toggle(value, event);
      onCheckedChange?.(!currentChecked, { reason: 'trigger-press', event });
    } else {
      checked = checked === true ? false : true;
      onCheckedChange?.(checked, { reason: 'trigger-press', event });
    }
  }
</script>

<button
  bind:this={ref}
  {...rest}
  type="button"
  role="checkbox"
  aria-checked={currentChecked === 'indeterminate' ? 'mixed' : currentChecked}
  disabled={currentDisabled}
  data-checked={currentChecked === true ? '' : undefined}
  data-unchecked={currentChecked === false ? '' : undefined}
  data-indeterminate={currentChecked === 'indeterminate' ? '' : undefined}
  data-disabled={currentDisabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, toggle)}
>
  {@render children?.()}
</button>
{#if currentName}
  <input aria-hidden="true" tabindex="-1" type="checkbox" name={currentName} {value} {required} checked={currentChecked === true} disabled={currentDisabled} style="position:absolute;pointer-events:none;opacity:0;margin:0" />
{/if}
