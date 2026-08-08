<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLButtonAttributes } from 'svelte/elements'; import { composeEventHandlers } from '../shared/events.js'; import { getPopoverContext } from './popover-context.svelte.js';
  export interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; ref?: HTMLButtonElement | null; }
  let { children, ref = $bindable(null), onclick, ...rest }: Props = $props(); const popover = getPopoverContext();
</script>
<button bind:this={ref} {...rest} type="button" onclick={composeEventHandlers(onclick, (event) => { popover.setOpen(false, 'close-press', event); popover.trigger?.focus(); })}>{@render children?.()}</button>
