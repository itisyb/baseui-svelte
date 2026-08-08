<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getNumberFieldContext } from './number-field-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; pixelSensitivity?: number; ref?: HTMLDivElement | null; }
  let { children, pixelSensitivity = 2, ref = $bindable(null), onpointerdown, ...rest }: Props = $props();
  const numberField = getNumberFieldContext();
  let scrubbing = $state(false);

  function start(event: PointerEvent) {
    onpointerdown?.(event as PointerEvent & { currentTarget: EventTarget & HTMLDivElement });
    if (event.defaultPrevented || numberField.disabled || numberField.readOnly || !(event.currentTarget instanceof HTMLElement)) return;
    event.preventDefault();
    const startX = event.clientX;
    const startValue = numberField.value ?? 0;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    scrubbing = true;
    const move = (moveEvent: PointerEvent) => {
      const steps = Math.round((moveEvent.clientX - startX) / pixelSensitivity);
      numberField.setValue(numberField.clamp(startValue + steps * numberField.step), 'scrub', moveEvent);
    };
    const end = () => {
      scrubbing = false;
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', end);
      target.removeEventListener('pointercancel', end);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', end);
    target.addEventListener('pointercancel', end);
  }
</script>

<div bind:this={ref} {...rest} role="presentation" data-scrubbing={scrubbing ? '' : undefined} onpointerdown={start}>
  {@render children?.()}
</div>
