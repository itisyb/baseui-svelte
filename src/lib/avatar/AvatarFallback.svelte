<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getAvatarContext } from './avatar-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    delay?: number;
    ref?: HTMLSpanElement | null;
  }
  let { children, delay = 0, ref = $bindable(null), ...rest }: Props = $props();
  const avatar = getAvatarContext();
  let delayElapsed = $state(false);
  $effect(() => {
    delayElapsed = delay === 0;
    if (delay === 0) return;
    const timeout = window.setTimeout(() => { delayElapsed = true; }, delay);
    return () => window.clearTimeout(timeout);
  });
  let visible = $derived(delayElapsed && avatar.status !== 'loaded');
</script>

{#if visible}
  <span bind:this={ref} {...rest} data-image-status={avatar.status}>
    {@render children?.()}
  </span>
{/if}
