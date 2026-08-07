import { getContext, setContext } from 'svelte';
import type { Direction } from '../shared/types.js';

const DIRECTION_CONTEXT = Symbol('base-ui-direction');

export class DirectionState {
  direction = $state<Direction>('ltr');
}

export function setDirectionContext(state: DirectionState): DirectionState {
  setContext(DIRECTION_CONTEXT, state);
  return state;
}

export function getDirectionContext(fallback: Direction = 'ltr'): Direction {
  return getContext<DirectionState | undefined>(DIRECTION_CONTEXT)?.direction ?? fallback;
}
