<script lang="ts">
  import type { Snippet } from 'svelte'; import type { OnValueChange } from '../shared/types.js'; import type { PopoverOpenReason } from '../popover/popover-context.svelte.js'; import PopoverRoot from '../popover/PopoverRoot.svelte'; import { SelectState, setSelectContext } from './select-context.svelte.js';
  interface Props { children?: Snippet; value?: string | null; open?: boolean; onValueChange?: OnValueChange<string, 'item-press' | 'keyboard'>; onOpenChange?: OnValueChange<boolean, PopoverOpenReason>; name?: string; disabled?: boolean; required?: boolean; }
  let { children, value = $bindable(null), open = $bindable(false), onValueChange, onOpenChange, name, disabled = false, required = false }: Props = $props(); const uid = $props.id(); const select = setSelectContext(new SelectState()); select.labelId = `${uid}-label`; select.triggerId = `${uid}-trigger`; select.listId = `${uid}-list`;
  select.select = (next, event) => { if (disabled) return; value = next; onValueChange?.(next, { reason: event instanceof KeyboardEvent ? 'keyboard' : 'item-press', event }); open = false; };
  $effect.pre(() => { select.value = value; select.disabled = disabled; select.required = required; select.name = name; });
</script>
<PopoverRoot bind:open onOpenChange={(next, details) => { open = next; onOpenChange?.(next, details); }}>{@render children?.()}</PopoverRoot>
{#if name}<input type="hidden" {name} value={value ?? ''} {required} disabled={disabled} />{/if}
