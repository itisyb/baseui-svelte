import type { Snippet } from 'svelte';

export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';
export type ChangeReason = 'trigger-press' | 'keyboard' | 'outside-press' | 'escape-key' | 'programmatic';

export interface ChangeDetails<R extends string = ChangeReason> {
  reason: R;
  event?: Event;
}

export type ChildSnippet<Props extends object> = Snippet<[Props]>;

export interface WithChild<Props extends object> {
  /** Render a custom element. Spread the supplied props onto the element. */
  child?: ChildSnippet<Props>;
}

export type OnValueChange<T, R extends string = ChangeReason> = (
  value: T,
  details: ChangeDetails<R>,
) => void;
