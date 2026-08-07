<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getToolbarContext } from './toolbar-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; ref?: HTMLDivElement | null; }
  let { children, ref = $bindable(null), ...rest }: Props = $props(); const toolbar = getToolbarContext();
</script>
<div bind:this={ref} {...rest} role="separator" aria-orientation={toolbar.orientation === 'horizontal' ? 'vertical' : 'horizontal'}>{@render children?.()}</div>
