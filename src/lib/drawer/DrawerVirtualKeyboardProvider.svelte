<script lang="ts">import type { Snippet } from 'svelte'; export interface Props { children?: Snippet; } let { children }: Props = $props();</script>{@render children?.()}
