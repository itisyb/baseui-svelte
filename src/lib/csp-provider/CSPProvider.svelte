<script lang="ts">import type { Snippet } from 'svelte'; import { CSPState, setCSPContext } from './csp-context.svelte.js'; interface Props { children?: Snippet; nonce?: string; } let { children, nonce }: Props = $props(); const csp = setCSPContext(new CSPState()); $effect.pre(() => { csp.nonce = nonce; });</script>
{@render children?.()}
