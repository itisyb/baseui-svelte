<script lang="ts">
  import type { Snippet } from 'svelte'; import type { HTMLAttributes } from 'svelte/elements'; import { getSelectContext } from './select-context.svelte.js';
  export interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> { children?: Snippet<[string | null, string | undefined]>; placeholder?: string; ref?: HTMLSpanElement | null; }
  let { children, placeholder = '', ref = $bindable(null), ...rest }: Props = $props(); const select = getSelectContext();
</script>
<span bind:this={ref} {...rest} data-placeholder={select.value === null ? '' : undefined}>{#if children}{@render children(select.value, select.selectedLabel)}{:else}{select.selectedLabel ?? placeholder}{/if}</span>
