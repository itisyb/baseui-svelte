<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { onDestroy } from 'svelte';
  import { getFieldContext } from './field-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLParagraphElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getFieldContext();
  state.descriptionMounted = true;
  onDestroy(() => { state.descriptionMounted = false; });
</script>

<p bind:this={ref} {...rest} id={state.descriptionId} data-disabled={state.disabled ? '' : undefined} data-invalid={state.invalid ? '' : undefined}>
  {@render children?.()}
</p>
