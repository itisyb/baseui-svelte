<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getRadioGroupContext } from '../radio-group/radio-group-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    children?: Snippet;
    value: string;
    keepMounted?: boolean;
    ref?: HTMLSpanElement | null;
  }
  let { children, value, keepMounted = false, ref = $bindable(null), ...rest }: Props = $props();
  const group = getRadioGroupContext();
  let checked = $derived(group.value === value);
</script>

{#if keepMounted || checked}
  <span bind:this={ref} {...rest} hidden={!checked} data-checked={checked ? '' : undefined}>
    {@render children?.()}
  </span>
{/if}
