<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js'; import { getPopoverContext } from './popover-context.svelte.js';
  interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; ref?: HTMLButtonElement | null; }
  let { children, ref = $bindable(null), disabled = false, onclick, ...rest }: Props = $props(); const popover = getPopoverContext();
  $effect.pre(() => { popover.trigger = ref; });
</script>
<button bind:this={ref} {...rest} type="button" aria-haspopup="dialog" aria-expanded={popover.open} aria-controls={popover.open ? popover.popupId : undefined} {disabled} data-popup-open={popover.open ? '' : undefined} onclick={composeEventHandlers(onclick, (event) => { if (!disabled) popover.setOpen(!popover.open, 'trigger-press', event); })}>{@render children?.()}</button>
