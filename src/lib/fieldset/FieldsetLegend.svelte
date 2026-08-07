<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  interface Props extends Omit<HTMLAttributes<HTMLLegendElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLLegendElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
</script>

<legend bind:this={ref} {...rest}>{@render children?.()}</legend>
