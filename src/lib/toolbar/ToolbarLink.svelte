<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getToolbarContext } from './toolbar-context.svelte.js';
  interface Props extends Omit<HTMLAnchorAttributes, 'children'> { children?: Snippet; href: string; ref?: HTMLAnchorElement | null; }
  let { children, href, ref = $bindable(null), onkeydown, ...rest }: Props = $props();
  const toolbar = getToolbarContext();
  $effect(() => { if (ref) return toolbar.register(ref); });
</script>
<a bind:this={ref} {...rest} {href} tabindex={toolbar.items[0] === ref ? 0 : -1} onkeydown={composeEventHandlers(onkeydown, (event) => toolbar.handleKeydown(event))}>{@render children?.()}</a>
