<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getDialogContext } from './dialog-context.svelte.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet;
    ref?: HTMLButtonElement | null;
  }
  let { children, disabled = false, ref = $bindable(null), onclick, ...rest }: Props = $props();
  const state = getDialogContext();
  $effect.pre(() => { state.trigger = ref; });
</script>

<button bind:this={ref} {...rest} type="button" aria-haspopup="dialog" aria-expanded={state.open} aria-controls={state.open ? state.popupId : undefined} {disabled} data-popup-open={state.open ? '' : undefined} onclick={composeEventHandlers(onclick, (event) => { if (!disabled) state.setOpen(!state.open, 'trigger-press', event); })}>
  {@render children?.()}
</button>
