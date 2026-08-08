<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { getFieldContext } from './field-context.svelte.js';

  interface ValidityData {
    validity: ValidityState | null;
    validationMessage: string;
  }
  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet<[ValidityData]>;
    ref?: HTMLDivElement | null;
  }
  let { children, ref = $bindable(null), ...rest }: Props = $props();
  const state = getFieldContext();
</script>

<div bind:this={ref} {...rest}>
  {@render children?.({ validity: state.validity, validationMessage: state.validationMessage })}
</div>
