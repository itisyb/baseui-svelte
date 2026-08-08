<script lang="ts">
  import type { Snippet } from 'svelte'; import type { OnValueChange } from '../shared/types.js'; import type { PopoverOpenReason } from '../popover/popover-context.svelte.js'; import PopoverRoot from '../popover/PopoverRoot.svelte'; import { MenuState, setMenuContext, type MenuHandle } from './menu-context.svelte.js';
  export interface Props { children?: Snippet; open?: boolean; onOpenChange?: OnValueChange<boolean, PopoverOpenReason>; disabled?: boolean; modal?: boolean; handle?: MenuHandle; }
  let { children, open = $bindable(false), onOpenChange, disabled = false, modal = true, handle }: Props = $props(); const menu = setMenuContext(new MenuState());
  $effect.pre(() => { menu.disabled = disabled; if (handle && handle.open !== open) open = handle.open; });
  $effect.pre(() => { if (handle) handle.open = open; });
</script>
<PopoverRoot bind:open onOpenChange={(next, details) => { open = next; onOpenChange?.(next, details); }}>{@render children?.()}</PopoverRoot>
