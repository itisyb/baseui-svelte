<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import type { Orientation } from '../shared/types.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    orientation?: Orientation;
    ref?: HTMLDivElement | null;
  }

  let {
    children,
    orientation = 'horizontal',
    ref = $bindable(null),
    role = 'separator',
    ...rest
  }: Props = $props();
</script>

<div
  bind:this={ref}
  {...rest}
  {role}
  aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
  data-orientation={orientation}
>
  {@render children?.()}
</div>
