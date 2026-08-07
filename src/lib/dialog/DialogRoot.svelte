<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { OnValueChange } from '../shared/types.js';
  import { DialogState, type DialogOpenReason, setDialogContext } from './dialog-context.svelte.js';
  import type { DialogHandle } from './dialog-handle.svelte.js';

  interface Props {
    children?: Snippet;
    open?: boolean;
    modal?: boolean;
    onOpenChange?: OnValueChange<boolean, DialogOpenReason>;
    handle?: DialogHandle;
  }
  let { children, open = $bindable(false), modal = true, onOpenChange, handle }: Props = $props();
  const uid = $props.id();
  const state = setDialogContext(new DialogState());
  state.popupId = `${uid}-popup`;
  state.titleId = `${uid}-title`;
  state.descriptionId = `${uid}-description`;
  state.setOpen = (next, reason, event) => {
    if (open === next) return;
    open = next;
    onOpenChange?.(next, { reason, event });
    if (!next) queueMicrotask(() => state.trigger?.focus({ preventScroll: true }));
  };
  $effect.pre(() => {
    if (handle && handle.open !== open) open = handle.open;
    state.open = open;
    state.modal = modal;
  });
  $effect.pre(() => { if (handle) handle.open = open; });
</script>

{@render children?.()}
