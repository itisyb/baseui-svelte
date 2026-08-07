import type { Direction, Orientation } from './types.js';

interface RovingFocusOptions {
  current: HTMLElement;
  candidates: HTMLElement[];
  event: KeyboardEvent;
  orientation?: Orientation;
  direction?: Direction;
  loop?: boolean;
}

export function moveRovingFocus({
  current,
  candidates,
  event,
  orientation = 'horizontal',
  direction = 'ltr',
  loop = true,
}: RovingFocusOptions): boolean {
  const enabled = candidates.filter((candidate) => candidate.getAttribute('aria-disabled') !== 'true');
  const index = enabled.indexOf(current);
  if (index < 0 || enabled.length === 0) return false;

  const previousKey = orientation === 'vertical' ? 'ArrowUp' : direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  let nextIndex: number | undefined;

  if (event.key === previousKey) nextIndex = index - 1;
  if (event.key === nextKey) nextIndex = index + 1;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = enabled.length - 1;
  if (nextIndex === undefined) return false;

  event.preventDefault();
  if (loop) nextIndex = (nextIndex + enabled.length) % enabled.length;
  else nextIndex = Math.max(0, Math.min(enabled.length - 1, nextIndex));
  enabled[nextIndex]?.focus();
  return true;
}
