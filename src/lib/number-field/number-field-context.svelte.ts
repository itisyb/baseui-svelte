import { createContext } from 'svelte';

export type NumberFieldChangeReason = 'input' | 'increment' | 'decrement' | 'keyboard' | 'scrub';

export function snapToStep(value: number, min: number, step: number): number {
  const precision = Math.max(0, (step.toString().split('.')[1] ?? '').length);
  const snapped = min + Math.round((value - min) / step) * step;
  return Number(snapped.toFixed(precision));
}

export class NumberFieldState {
  value = $state<number | null>(null);
  text = $state('');
  focused = $state(false);
  disabled = $state(false);
  readOnly = $state(false);
  required = $state(false);
  min = $state(Number.NEGATIVE_INFINITY);
  max = $state(Number.POSITIVE_INFINITY);
  step = $state(1);
  name = $state<string | undefined>();
  inputId = $state('');
  input = $state<HTMLInputElement | null>(null);
  locale = $state<string | undefined>();
  formatOptions = $state<Intl.NumberFormatOptions | undefined>();
  setValue: (value: number | null, reason: NumberFieldChangeReason, event: Event) => void = () => {};

  clamp(value: number): number {
    return Math.min(this.max, Math.max(this.min, value));
  }

  format(value: number | null): string {
    if (value === null || !Number.isFinite(value)) return '';
    return new Intl.NumberFormat(this.locale, this.formatOptions).format(value);
  }

  parse(text: string): number | null {
    const normalized = text.trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized || normalized === '-' || normalized === '.') return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  stepBy(multiplier: number, reason: NumberFieldChangeReason, event: Event): void {
    if (this.disabled || this.readOnly) return;
    const start = this.value ?? (Number.isFinite(this.min) ? this.min : 0);
    this.setValue(this.clamp(snapToStep(start + this.step * multiplier, Number.isFinite(this.min) ? this.min : 0, this.step)), reason, event);
  }
}

export const [getNumberFieldContext, setNumberFieldContext] = createContext<NumberFieldState>();
