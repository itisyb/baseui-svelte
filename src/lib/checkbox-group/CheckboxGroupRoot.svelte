<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { CheckboxGroupState, setCheckboxGroupContext } from './checkbox-group-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: string[];
    onValueChange?: OnValueChange<string[], 'item-press'>;
    name?: string;
    disabled?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, value = $bindable([]), onValueChange, name, disabled = false, ref = $bindable(null), ...rest }: Props = $props();
  const group = setCheckboxGroupContext(new CheckboxGroupState());
  group.toggle = (itemValue, event) => {
    if (disabled) return;
    value = value.includes(itemValue) ? value.filter((item) => item !== itemValue) : [...value, itemValue];
    onValueChange?.(value, { reason: 'item-press', event });
  };
  $effect.pre(() => { group.values = value; group.name = name; group.disabled = disabled; });
</script>
<div bind:this={ref} {...rest} role="group" data-disabled={disabled ? '' : undefined}>{@render children?.()}</div>
