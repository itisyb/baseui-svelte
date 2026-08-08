<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { CollapsibleState, setCollapsibleContext } from './collapsible-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    open?: boolean;
    onOpenChange?: OnValueChange<boolean, 'trigger-press'>;
    disabled?: boolean;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    open = $bindable(false),
    onOpenChange,
    disabled = false,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const state = setCollapsibleContext(new CollapsibleState());
  state.triggerId = `${uid}-trigger`;
  state.panelId = `${uid}-panel`;
  state.toggle = (event) => {
    if (disabled) return;
    open = !open;
    onOpenChange?.(open, { reason: 'trigger-press', event });
  };
  $effect.pre(() => {
    state.open = open;
    state.disabled = disabled;
  });
</script>

<div bind:this={ref} {...rest} data-open={open ? '' : undefined} data-closed={!open ? '' : undefined} data-disabled={disabled ? '' : undefined}>
  {@render children?.()}
</div>
