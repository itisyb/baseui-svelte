<script lang="ts">
  import type { Snippet } from 'svelte'; import { TooltipProviderState, setTooltipProvider } from './tooltip-provider-context.svelte.js';
  interface Props { children?: Snippet; delay?: number; closeDelay?: number; }
  let { children, delay = 600, closeDelay = 0 }: Props = $props(); const provider = setTooltipProvider(new TooltipProviderState());
  $effect.pre(() => { provider.delay = delay; provider.closeDelay = closeDelay; });
</script>
{@render children?.()}
