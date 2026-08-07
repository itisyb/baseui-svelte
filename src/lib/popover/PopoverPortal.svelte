<script lang="ts">
  import type { Snippet } from 'svelte'; import Portal from '../portal/Portal.svelte'; import { getPopoverContext } from './popover-context.svelte.js';
  interface Props { children?: Snippet; target?: HTMLElement | string; keepMounted?: boolean; }
  let { children, target, keepMounted = false }: Props = $props(); const popover = getPopoverContext();
</script>
{#if keepMounted || popover.open}<Portal {target}>{@render children?.()}</Portal>{/if}
