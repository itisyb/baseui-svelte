<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getToolbarContext } from './toolbar-context.svelte.js';
  interface Props extends Omit<HTMLButtonAttributes, 'children'> { children?: Snippet; ref?: HTMLButtonElement | null; }
  let { children, ref = $bindable(null), onkeydown, ...rest }: Props = $props();
  const toolbar = getToolbarContext();
  $effect(() => { if (ref) return toolbar.register(ref); });
</script>
<button bind:this={ref} {...rest} type="button" tabindex={toolbar.items[0] === ref ? 0 : -1} onkeydown={composeEventHandlers(onkeydown, (event) => toolbar.handleKeydown(event))}>{@render children?.()}</button>
