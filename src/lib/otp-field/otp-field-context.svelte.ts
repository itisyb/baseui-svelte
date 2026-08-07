import { createContext, untrack } from 'svelte';

export type OTPValidationType = 'numeric' | 'alphanumeric' | 'none';
export type OTPChangeReason = 'input' | 'keyboard' | 'paste';

export class OTPFieldState {
  value = $state('');
  length = $state(6);
  disabled = $state(false);
  readOnly = $state(false);
  required = $state(false);
  mask = $state(false);
  name = $state<string | undefined>();
  validationType = $state<OTPValidationType>('numeric');
  baseId = $state('');
  inputs = $state<HTMLInputElement[]>([]);
  setValue: (value: string, reason: OTPChangeReason, event: Event) => void = () => {};

  normalize(value: string): string {
    const filtered = this.validationType === 'numeric' ? value.replace(/\D/g, '') : this.validationType === 'alphanumeric' ? value.replace(/[^a-zA-Z0-9]/g, '') : value;
    return Array.from(filtered).slice(0, this.length).join('');
  }
  register(input: HTMLInputElement): () => void {
    untrack(() => { this.inputs = [...this.inputs, input]; });
    return () => untrack(() => { this.inputs = this.inputs.filter((item) => item !== input); });
  }
  focus(index: number): void { const target = this.inputs[Math.max(0, Math.min(this.inputs.length - 1, index))]; target?.focus(); target?.select(); }
}
export const [getOTPFieldContext, setOTPFieldContext] = createContext<OTPFieldState>();
