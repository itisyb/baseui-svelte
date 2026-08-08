<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getProgressContext } from './progress-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    ref?: HTMLDivElement | null;
  }

  let { children, ref = $bindable(null), style, ...rest }: Props = $props();
  const state = getProgressContext();
  let indicatorStyle = $derived([
    `--progress-value: ${state.percentage ?? 0}%`,
    typeof style === 'string' ? style : '',
  ].filter(Boolean).join(';'));
</script>

<div bind:this={ref} {...rest} style={indicatorStyle} data-status={state.status}>
  {@render children?.()}
</div>
