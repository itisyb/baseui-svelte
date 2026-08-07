<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAnchorAttributes } from 'svelte/elements'; import { getMenuContext, type MenuItemRecord } from './menu-context.svelte.js';
  interface Props extends Omit<HTMLAnchorAttributes, 'children'> { children?: Snippet; href: string; disabled?: boolean; textValue?: string; ref?: HTMLAnchorElement | null; }
  let { children, href, disabled = false, textValue = '', ref = $bindable(null), onpointermove, ...rest }: Props = $props(); const menu = getMenuContext(); $effect(() => { if (!ref) return; const item: MenuItemRecord = { element: ref, disabled, text: textValue || ref.textContent?.trim() || '' }; return menu.register(item); });
</script>
<a bind:this={ref} {...rest} {href} role="menuitem" tabindex="-1" aria-disabled={disabled || undefined} data-disabled={disabled ? '' : undefined} onpointermove={(event) => { onpointermove?.(event as PointerEvent & { currentTarget: EventTarget & HTMLAnchorElement }); if (!disabled) ref?.focus(); }}>{@render children?.()}</a>
