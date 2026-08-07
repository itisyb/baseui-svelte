import { getContext, setContext } from 'svelte';
const TOOLTIP_PROVIDER = Symbol('base-ui-tooltip-provider');
export class TooltipProviderState { delay = $state(600); closeDelay = $state(0); }
export function setTooltipProvider(state: TooltipProviderState) { setContext(TOOLTIP_PROVIDER, state); return state; }
export function getTooltipProvider() { return getContext<TooltipProviderState | undefined>(TOOLTIP_PROVIDER); }
