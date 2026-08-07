<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';
  interface Props extends Omit<HTMLFieldsetAttributes, 'children'> {
    children?: Snippet;
    ref?: HTMLFieldSetElement | null;
  }
  let { children, disabled = false, ref = $bindable(null), ...rest }: Props = $props();
</script>

<fieldset bind:this={ref} {...rest} {disabled} data-disabled={disabled ? '' : undefined}>
  {@render children?.()}
</fieldset>
