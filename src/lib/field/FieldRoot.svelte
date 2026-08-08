<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { FieldState, setFieldContext } from './field-context.svelte.js';

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    invalid?: boolean;
    ref?: HTMLDivElement | null;
  }
  let { children, name, disabled = false, required = false, invalid = false, ref = $bindable(null), ...rest }: Props = $props();
  const uid = $props.id();
  const state = setFieldContext(new FieldState());
  state.controlId = `${uid}-control`;
  state.labelId = `${uid}-label`;
  state.descriptionId = `${uid}-description`;
  state.errorId = `${uid}-error`;
  $effect.pre(() => {
    state.name = name;
    state.disabled = disabled;
    state.required = required;
    if (invalid) state.invalid = true;
  });
</script>

<div bind:this={ref} {...rest} data-disabled={disabled ? '' : undefined} data-invalid={state.invalid ? '' : undefined} data-valid={!state.invalid ? '' : undefined} data-touched={state.touched ? '' : undefined} data-dirty={state.dirty ? '' : undefined}>
  {@render children?.()}
</div>
