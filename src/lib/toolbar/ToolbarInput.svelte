<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { getToolbarContext } from './toolbar-context.svelte.js';
  export interface Props extends HTMLInputAttributes { value?: string | number | readonly string[] | null; ref?: HTMLInputElement | null; }
  let { value = $bindable(), ref = $bindable(null), ...rest }: Props = $props();
  const toolbar = getToolbarContext();
  $effect(() => { if (ref) return toolbar.register(ref); });
</script>
<input bind:this={ref} bind:value {...rest} tabindex={toolbar.items[0] === ref ? 0 : -1} />
