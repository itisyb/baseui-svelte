<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { composeEventHandlers } from '../shared/events.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet;
    pressed?: boolean;
    onPressedChange?: OnValueChange<boolean, 'trigger-press'>;
    ref?: HTMLButtonElement | null;
  }

  let {
    children,
    pressed = $bindable(false),
    onPressedChange,
    disabled = false,
    ref = $bindable(null),
    onclick,
    ...rest
  }: Props = $props();

  function toggle(event: MouseEvent) {
    if (disabled) return;
    pressed = !pressed;
    onPressedChange?.(pressed, { reason: 'trigger-press', event });
  }
</script>

<button
  bind:this={ref}
  {...rest}
  type="button"
  aria-pressed={pressed}
  {disabled}
  data-pressed={pressed ? '' : undefined}
  data-unpressed={!pressed ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  onclick={composeEventHandlers(onclick, toggle)}
>
  {@render children?.()}
</button>
