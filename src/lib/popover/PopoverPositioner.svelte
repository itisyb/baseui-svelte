<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements';
  import { arrow, autoUpdate, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
  import { getPopoverContext } from './popover-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet; side?: 'top' | 'right' | 'bottom' | 'left'; align?: 'start' | 'center' | 'end'; sideOffset?: number; alignOffset?: number; collisionPadding?: number; strategy?: 'absolute' | 'fixed'; keepMounted?: boolean; ref?: HTMLDivElement | null;
  }
  let { children, side = 'bottom', align = 'center', sideOffset = 8, alignOffset = 0, collisionPadding = 8, strategy = 'absolute', keepMounted = false, ref = $bindable(null), style, ...rest }: Props = $props();
  const popover = getPopoverContext(); let x = $state(0); let y = $state(0); let positioned = $state(false);
  let placement = $derived<Placement>(align === 'center' ? side : `${side}-${align}`);
  $effect.pre(() => { popover.positioner = ref; });
  $effect(() => {
    const trigger = popover.trigger; const positioner = ref; const arrowElement = popover.arrow; const currentPlacement = placement;
    if (!trigger || !positioner || !popover.open) return;
    return autoUpdate(trigger, positioner, async () => {
      const middleware = [offset({ mainAxis: sideOffset, crossAxis: alignOffset }), flip({ padding: collisionPadding }), shift({ padding: collisionPadding })];
      if (arrowElement) middleware.push(arrow({ element: arrowElement }));
      const result = await computePosition(trigger, positioner, { placement: currentPlacement, strategy, middleware });
      x = result.x; y = result.y; positioned = true;
      const [resolvedSide, resolvedAlign = 'center'] = result.placement.split('-');
      popover.side = resolvedSide as typeof popover.side; popover.align = resolvedAlign as typeof popover.align;
      popover.arrowX = result.middlewareData.arrow?.x; popover.arrowY = result.middlewareData.arrow?.y;
    });
  });
  let positionStyle = $derived(`position:${strategy};left:0;top:0;transform:translate(${x}px, ${y}px);${typeof style === 'string' ? style : ''}`);
</script>
{#if keepMounted || popover.open}
  <div bind:this={ref} {...rest} style={positionStyle} hidden={!popover.open} data-side={popover.side} data-align={popover.align} data-positioned={positioned ? '' : undefined}>{@render children?.()}</div>
{/if}
