<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Direction, Orientation } from '../shared/types.js';
  import { setToolbarContext, ToolbarState } from './toolbar-context.svelte.js';
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> { children?: Snippet; orientation?: Orientation; direction?: Direction; loop?: boolean; ref?: HTMLDivElement | null; }
  let { children, orientation = 'horizontal', direction = 'ltr', loop = true, ref = $bindable(null), ...rest }: Props = $props();
  const toolbar = setToolbarContext(new ToolbarState());
  $effect.pre(() => { toolbar.orientation = orientation; toolbar.direction = direction; toolbar.loop = loop; });
</script>
<div bind:this={ref} {...rest} role="toolbar" aria-orientation={orientation} data-orientation={orientation}>{@render children?.()}</div>
