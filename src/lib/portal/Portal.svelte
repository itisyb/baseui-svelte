<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    target?: HTMLElement | string;
    disabled?: boolean;
  }
  let { children, target, disabled = false }: Props = $props();

  function portal(node: HTMLDivElement) {
    if (disabled || typeof document === 'undefined') return;
    const destination = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    (destination ?? document.body).append(node);
    return () => node.remove();
  }
</script>

<div data-base-ui-portal="" {@attach portal}>
  {@render children?.()}
</div>
