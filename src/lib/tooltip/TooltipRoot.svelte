<script lang="ts">
  import type { Snippet } from 'svelte'; import type { OnValueChange } from '../shared/types.js'; import type { PopoverHandle } from '../popover/popover-handle.svelte.js'; import PopoverRoot from '../popover/PopoverRoot.svelte';
  export interface Props { children?: Snippet; open?: boolean; onOpenChange?: OnValueChange<boolean, 'hover' | 'focus' | 'escape-key'>; handle?: PopoverHandle; }
  let { children, open = $bindable(false), onOpenChange, handle }: Props = $props();
</script>
<PopoverRoot bind:open {handle} onOpenChange={(next, details) => onOpenChange?.(next, { reason: details.reason === 'escape-key' ? 'escape-key' : 'hover', event: details.event })}>
  {@render children?.()}
</PopoverRoot>
