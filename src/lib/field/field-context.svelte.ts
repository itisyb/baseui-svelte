import { createContext } from 'svelte';

export class FieldState {
  controlId = $state('');
  labelId = $state('');
  descriptionId = $state('');
  errorId = $state('');
  name = $state<string | undefined>();
  disabled = $state(false);
  required = $state(false);
  invalid = $state(false);
  touched = $state(false);
  dirty = $state(false);
  descriptionMounted = $state(false);
  errorMounted = $state(false);
  validity = $state<ValidityState | null>(null);
  validationMessage = $state('');

  updateValidity(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    this.validity = control.validity;
    this.validationMessage = control.validationMessage;
    this.invalid = !control.validity.valid;
  }

  get describedBy(): string | undefined {
    const ids = [this.descriptionMounted && this.descriptionId, this.errorMounted && this.invalid && this.errorId].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }
}

export const [getFieldContext, setFieldContext] = createContext<FieldState>();
