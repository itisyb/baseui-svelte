<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  export interface Props extends HTMLInputAttributes {
    ref?: HTMLInputElement | null;
    value?: string | number | readonly string[] | null;
  }

  let { ref = $bindable(null), value = $bindable(), ...rest }: Props = $props();
</script>

<input bind:this={ref} bind:value {...rest} />
