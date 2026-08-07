<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ProgressState, setProgressContext } from './progress-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: number | null;
    max?: number;
    getAriaValueText?: (formattedValue: string | null, value: number | null) => string | undefined;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    value = null,
    max = 100,
    getAriaValueText,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const state = setProgressContext(new ProgressState(null, 100));
  state.labelId = `${uid}-label`;
  $effect.pre(() => {
    state.value = value;
    state.max = max > 0 ? max : 100;
  });
  let formatted = $derived(state.percentage === null ? null : `${Math.round(state.percentage)}%`);
</script>

<div
  bind:this={ref}
  {...rest}
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax={state.max}
  aria-valuenow={state.value ?? undefined}
  aria-valuetext={getAriaValueText?.(formatted, state.value)}
  aria-labelledby={state.labelId}
  data-status={state.status}
  data-value={state.value ?? undefined}
>
  {@render children?.()}
</div>
