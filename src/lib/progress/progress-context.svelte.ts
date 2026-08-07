import { createContext } from 'svelte';

export type ProgressStatus = 'indeterminate' | 'progressing' | 'complete';

export class ProgressState {
  #value = $state<number | null>(null);
  #max = $state(100);
  labelId = $state('');

  constructor(value: number | null, max: number) {
    this.#value = value;
    this.#max = max;
  }

  get value() { return this.#value; }
  set value(value: number | null) { this.#value = value; }
  get max() { return this.#max; }
  set max(max: number) { this.#max = max; }
  get status(): ProgressStatus {
    if (this.#value === null) return 'indeterminate';
    return this.#value >= this.#max ? 'complete' : 'progressing';
  }
  get percentage(): number | null {
    return this.#value === null ? null : Math.min(100, Math.max(0, (this.#value / this.#max) * 100));
  }
}

export const [getProgressContext, setProgressContext] = createContext<ProgressState>();
