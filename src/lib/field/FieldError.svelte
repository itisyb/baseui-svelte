<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onDestroy } from 'svelte';
  import { getFieldContext } from './field-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
    children?: Snippet;
    forceShow?: boolean;
    ref?: HTMLParagraphElement | null;
  }
  let { children, forceShow = false, ref = $bindable(null), ...rest }: Props = $props();
  const state = getFieldContext();
  state.errorMounted = true;
  onDestroy(() => { state.errorMounted = false; });
</script>

{#if forceShow || state.invalid}
  <p bind:this={ref} {...rest} id={state.errorId} role="alert" data-invalid="">
    {@render children?.()}
  </p>
{/if}
