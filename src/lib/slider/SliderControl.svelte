<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getSliderContext } from './slider-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), onpointerdown, ...rest }: Props = $props();
  const slider = getSliderContext();
  $effect.pre(() => { slider.control = ref; });
  function start(event: PointerEvent) {
    onpointerdown?.(event as PointerEvent & { currentTarget: EventTarget & HTMLDivElement });
    if (event.defaultPrevented || slider.disabled || !(event.currentTarget instanceof HTMLElement)) return;
    event.preventDefault();
    const target = event.currentTarget;
    const index = slider.closestIndex(slider.valueFromPointer(event));
    slider.setValueAt(index, slider.valueFromPointer(event), 'pointer', event);
    target.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) => slider.setValueAt(index, slider.valueFromPointer(moveEvent), 'pointer', moveEvent);
    const end = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', end);
      target.removeEventListener('pointercancel', end);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', end);
    target.addEventListener('pointercancel', end);
  }
</script>

<div bind:this={ref} {...rest} data-orientation={slider.orientation} data-disabled={slider.disabled ? '' : undefined} onpointerdown={start}>
  {@render children?.()}
</div>
