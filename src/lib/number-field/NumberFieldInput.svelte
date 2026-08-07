<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { composeEventHandlers } from '../shared/events.js';
  import { getNumberFieldContext } from './number-field-context.svelte.js';

  interface Props extends Omit<HTMLInputAttributes, 'value' | 'min' | 'max' | 'step'> { ref?: HTMLInputElement | null; }
  let { ref = $bindable(null), oninput, onfocus, onblur, onkeydown, ...rest }: Props = $props();
  const numberField = getNumberFieldContext();
  $effect.pre(() => { numberField.input = ref; });

  function handleInput(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    numberField.text = input.value;
    numberField.setValue(numberField.parse(input.value), 'input', event);
  }
  function handleFocus() { numberField.focused = true; }
  function handleBlur(event: FocusEvent) {
    numberField.focused = false;
    if (numberField.value !== null) {
      numberField.setValue(numberField.clamp(numberField.value), 'input', event);
    }
    numberField.text = numberField.format(numberField.value);
  }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') { event.preventDefault(); numberField.stepBy(event.shiftKey ? 10 : 1, 'keyboard', event); }
    if (event.key === 'ArrowDown') { event.preventDefault(); numberField.stepBy(event.shiftKey ? -10 : -1, 'keyboard', event); }
    if (event.key === 'Home' && Number.isFinite(numberField.min)) { event.preventDefault(); numberField.setValue(numberField.min, 'keyboard', event); }
    if (event.key === 'End' && Number.isFinite(numberField.max)) { event.preventDefault(); numberField.setValue(numberField.max, 'keyboard', event); }
  }
</script>

<input
  bind:this={ref}
  {...rest}
  id={numberField.inputId}
  type="text"
  role="spinbutton"
  inputmode="decimal"
  value={numberField.text}
  name={numberField.name}
  disabled={numberField.disabled}
  readonly={numberField.readOnly}
  required={numberField.required}
  aria-valuemin={Number.isFinite(numberField.min) ? numberField.min : undefined}
  aria-valuemax={Number.isFinite(numberField.max) ? numberField.max : undefined}
  aria-valuenow={numberField.value ?? undefined}
  data-disabled={numberField.disabled ? '' : undefined}
  data-readonly={numberField.readOnly ? '' : undefined}
  oninput={composeEventHandlers(oninput, handleInput)}
  onfocus={composeEventHandlers(onfocus, handleFocus)}
  onblur={composeEventHandlers(onblur, handleBlur)}
  onkeydown={composeEventHandlers(onkeydown, handleKeydown)}
/>
