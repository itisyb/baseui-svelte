<script lang="ts">
  import type { HTMLImgAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getAvatarContext } from './avatar-context.svelte.js';
  interface Props extends HTMLImgAttributes {
    ref?: HTMLImageElement | null;
  }
  let { src, alt = '', ref = $bindable(null), onload, onerror, ...rest }: Props = $props();
  const state = getAvatarContext();
  $effect.pre(() => { state.status = src ? 'loading' : 'idle'; });
</script>

{#if src}
  <img
    bind:this={ref}
    {...rest}
    {src}
    {alt}
    data-image-status={state.status}
    onload={composeEventHandlers(onload, () => { state.status = 'loaded'; })}
    onerror={composeEventHandlers(onerror, () => { state.status = 'error'; })}
  />
{/if}
