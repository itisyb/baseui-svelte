<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';
  export interface Props extends Omit<HTMLFormAttributes, 'children'> {
    children?: Snippet;
    errors?: Record<string, string | string[]>;
    onClearErrors?: (errors: Record<string, string | string[]>) => void;
    ref?: HTMLFormElement | null;
  }
  let { children, errors = {}, onClearErrors, ref = $bindable(null), oninput, ...rest }: Props = $props();
  function handleInput(event: Event) {
    oninput?.(event as Event & { currentTarget: EventTarget & HTMLFormElement });
    if (!event.defaultPrevented && Object.keys(errors).length) onClearErrors?.(errors);
  }
</script>

<form bind:this={ref} {...rest} oninput={handleInput}>
  {@render children?.()}
</form>
