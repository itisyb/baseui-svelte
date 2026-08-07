<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { composeEventHandlers } from '../shared/events.js';
  import { setSwitchContext, SwitchState } from './switch-context.svelte.js';

  type SwitchReason = 'trigger-press';
  interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    children?: Snippet;
    checked?: boolean;
    onCheckedChange?: OnValueChange<boolean, SwitchReason>;
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

  const state = setSwitchContext(new SwitchState());
  $effect.pre(() => {
    state.checked = checked;
    state.disabled = !!disabled;
  });

  function toggle(event: MouseEvent) {
    if (disabled) return;
    checked = !checked;
    onCheckedChange?.(checked, { reason: 'trigger-press', event });
  }
</script>

<button
  bind:this={ref}
  {...rest}
  type="button"
  role="switch"
  aria-checked={checked}
  {disabled}
  data-checked={checked ? '' : undefined}
  data-unchecked={!checked ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, toggle)}
>
  {@render children?.()}
</button>
{#if name}
  <input aria-hidden="true" tabindex="-1" type="checkbox" {name} {value} {required} checked={checked} disabled={disabled} style="position:absolute;pointer-events:none;opacity:0;margin:0" />
{/if}
