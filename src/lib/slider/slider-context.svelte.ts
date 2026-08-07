import { createContext } from 'svelte';
import type { Direction, Orientation } from '../shared/types.js';

export type SliderValue = number | number[];
export type SliderChangeReason = 'pointer' | 'keyboard';

export class SliderState {
  values = $state<number[]>([0]);
  min = $state(0);
  max = $state(100);
  step = $state(1);
  disabled = $state(false);
  orientation = $state<Orientation>('horizontal');
  direction = $state<Direction>('ltr');
  name = $state<string | undefined>();
  labelId = $state('');
  control = $state<HTMLDivElement | null>(null);
  setValueAt: (index: number, value: number, reason: SliderChangeReason, event: Event) => void = () => {};

  percentage(value: number): number {
    return this.max === this.min ? 0 : ((value - this.min) / (this.max - this.min)) * 100;
  }

  valueFromPointer(event: PointerEvent): number {
    if (!this.control) return this.min;
    const rect = this.control.getBoundingClientRect();
    let ratio = this.orientation === 'horizontal'
      ? (event.clientX - rect.left) / rect.width
      : 1 - (event.clientY - rect.top) / rect.height;
    if (this.orientation === 'horizontal' && this.direction === 'rtl') ratio = 1 - ratio;
    ratio = Math.max(0, Math.min(1, ratio));
    return this.min + ratio * (this.max - this.min);
  }

  closestIndex(value: number): number {
    return this.values.reduce((closest, candidate, index) =>
      Math.abs(candidate - value) < Math.abs(this.values[closest] - value) ? index : closest, 0);
  }
}

export const [getSliderContext, setSliderContext] = createContext<SliderState>();
