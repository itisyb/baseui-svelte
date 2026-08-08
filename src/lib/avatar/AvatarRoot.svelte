<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { AvatarState, setAvatarContext } from './avatar-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLSpanElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = setAvatarContext(new AvatarState());
</script>

<span bind:this={ref} {...rest} data-image-status={state.status}>
  {@render children?.()}
</span>
