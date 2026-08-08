<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getAccordionContext, getAccordionItemContext } from './accordion-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    keepMounted?: boolean;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    keepMounted = false,
    ref = $bindable(null),
    ontransitionend,
    style,
    ...rest
  }: Props = $props();
  const root = getAccordionContext();
  const item = getAccordionItemContext();
  let open = $derived(root.isOpen(item.value));
  const initiallyOpen = untrack(() => open);
  let mounted = $state(initiallyOpen);
  let status = $state<'closed' | 'starting' | 'idle' | 'ending'>(initiallyOpen ? 'idle' : 'closed');
  let height = $state<number | undefined>();
  let width = $state<number | undefined>();
  let openFrame = 0;
  let closeFrame = 0;

  function finishClose() {
    if (open) return;
    status = 'closed';
    if (!keepMounted) mounted = false;
  }

  function transitionTime(node: HTMLElement) {
    const computed = getComputedStyle(node);
    const durations = computed.transitionDuration.split(',').map(toMilliseconds);
    const delays = computed.transitionDelay.split(',').map(toMilliseconds);
    return Math.max(0, ...durations.map((duration, index) => duration + (delays[index] ?? delays[0] ?? 0)));
  }

  function toMilliseconds(value: string) {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return 0;
    return value.trim().endsWith('ms') ? parsed : parsed * 1000;
  }

  function panelAttachment(node: HTMLDivElement) {
    function measure() {
      height = node.scrollHeight;
      width = node.scrollWidth;
    }

    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);

    if (status === 'ending' && transitionTime(node) === 0) {
      closeFrame = requestAnimationFrame(finishClose);
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(closeFrame);
    };
  }

  function handleTransitionEnd(event: TransitionEvent) {
    if (event.target === event.currentTarget && status === 'ending') finishClose();
  }

  $effect(() => {
    cancelAnimationFrame(openFrame);
    cancelAnimationFrame(closeFrame);

    if (open) {
      mounted = true;
      status = 'starting';
      openFrame = requestAnimationFrame(() => {
        openFrame = requestAnimationFrame(() => {
          if (open) status = 'idle';
        });
      });
    } else if (mounted) {
      status = 'ending';
      closeFrame = requestAnimationFrame(() => {
        if (ref && transitionTime(ref) === 0) finishClose();
      });
    }

    return () => {
      cancelAnimationFrame(openFrame);
      cancelAnimationFrame(closeFrame);
    };
  });
</script>

{#if keepMounted || mounted}
  <div
    bind:this={ref}
    {...rest}
    id={item.panelId}
    role="region"
    aria-labelledby={item.triggerId}
    hidden={!open && status === 'closed'}
    data-open={open ? '' : undefined}
    data-closed={!open ? '' : undefined}
    data-starting-style={status === 'starting' ? '' : undefined}
    data-ending-style={status === 'ending' ? '' : undefined}
    style={style}
    style:--accordion-panel-height={height === undefined ? 'auto' : `${height}px`}
    style:--accordion-panel-width={width === undefined ? 'auto' : `${width}px`}
    ontransitionend={composeEventHandlers(ontransitionend, handleTransitionEnd)}
    {@attach panelAttachment}
  >
    {@render children?.()}
  </div>
{/if}
