<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { OnValueChange } from '../shared/types.js';
  import { PopoverState, type PopoverOpenReason, setPopoverContext } from './popover-context.svelte.js';
  import type { PopoverHandle } from './popover-handle.svelte.js';
  export interface Props { children?: Snippet; open?: boolean; onOpenChange?: OnValueChange<boolean, PopoverOpenReason>; handle?: PopoverHandle; }
  let { children, open = $bindable(false), onOpenChange, handle }: Props = $props();
  const uid = $props.id();
  const popover = setPopoverContext(new PopoverState());
  popover.popupId = `${uid}-popup`; popover.titleId = `${uid}-title`; popover.descriptionId = `${uid}-description`;
  popover.setOpen = (next, reason, event) => { if (open !== next) { open = next; onOpenChange?.(next, { reason, event }); } };
  $effect.pre(() => { if (handle && handle.open !== open) open = handle.open; popover.open = open; });
  $effect.pre(() => { if (handle) handle.open = open; });
</script>
{@render children?.()}
