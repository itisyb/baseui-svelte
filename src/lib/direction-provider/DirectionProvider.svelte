<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Direction } from '../shared/types.js';
  import { DirectionState, setDirectionContext } from './direction-context.svelte.js';
  interface Props { children?: Snippet; direction?: Direction; }
  let { children, direction = 'ltr' }: Props = $props();
  const state = setDirectionContext(new DirectionState());
  $effect.pre(() => { state.direction = direction; });
</script>
{@render children?.()}
