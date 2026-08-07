<script lang="ts">
  import type { Snippet } from 'svelte';
  import Portal from '../portal/Portal.svelte';
  import { getDialogContext } from './dialog-context.svelte.js';

  interface Props {
    children?: Snippet;
    target?: HTMLElement | string;
    keepMounted?: boolean;
  }
  let { children, target, keepMounted = false }: Props = $props();
  const state = getDialogContext();
</script>

{#if keepMounted || state.open}
  <Portal {target}>
    {@render children?.()}
  </Portal>
{/if}
