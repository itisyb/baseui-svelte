<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getPopoverContext } from '../popover/popover-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const tooltip = getPopoverContext();
  function attach() { const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') tooltip.setOpen(false, 'escape-key', event); }; document.addEventListener('keydown', keydown); return () => document.removeEventListener('keydown', keydown); }
</script>
{#if tooltip.open}<div bind:this={ref} {...rest} id={tooltip.popupId} role="tooltip" data-open="" data-side={tooltip.side} data-align={tooltip.align} {@attach attach}>{@render children?.()}</div>{/if}
