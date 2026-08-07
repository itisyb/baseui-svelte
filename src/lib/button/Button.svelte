<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { ChildSnippet } from '../shared/types.js';

  type ButtonChildProps = HTMLButtonAttributes & {
    'data-disabled'?: '';
  };

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet;
    child?: ChildSnippet<ButtonChildProps>;
    ref?: HTMLButtonElement | null;
  }

  let {
    children,
    child,
    disabled = false,
    type = 'button',
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  let childProps = $derived<ButtonChildProps>({
    ...rest,
    disabled,
    type,
    'data-disabled': disabled ? '' : undefined,
  });
</script>

{#if child}
  {@render child(childProps)}
{:else}
  <button bind:this={ref} {...rest} {disabled} {type} data-disabled={disabled ? '' : undefined}>
    {@render children?.()}
  </button>
{/if}
