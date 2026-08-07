import { getContext, setContext } from 'svelte';
const CSP_CONTEXT = Symbol('base-ui-csp');
export class CSPState { nonce = $state<string | undefined>(); }
export function setCSPContext(state: CSPState) { setContext(CSP_CONTEXT, state); return state; }
export function getCSPNonce() { return getContext<CSPState | undefined>(CSP_CONTEXT)?.nonce; }
