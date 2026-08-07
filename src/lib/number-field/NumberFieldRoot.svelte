<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { OnValueChange } from '../shared/types.js';
  import { NumberFieldState, type NumberFieldChangeReason, setNumberFieldContext } from './number-field-context.svelte.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    value?: number | null;
    onValueChange?: OnValueChange<number | null, NumberFieldChangeReason>;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
    locale?: string;
    formatOptions?: Intl.NumberFormatOptions;
    ref?: HTMLDivElement | null;
  }
  let {
    children,
    value = $bindable(null),
    onValueChange,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    disabled = false,
    readOnly = false,
    required = false,
    name,
    locale,
    formatOptions,
    ref = $bindable(null),
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const numberField = setNumberFieldContext(new NumberFieldState());
  numberField.inputId = `${uid}-input`;
  numberField.setValue = (next, reason, event) => {
    value = next;
    numberField.value = next;
    if (!numberField.focused) numberField.text = numberField.format(next);
    onValueChange?.(next, { reason, event });
  };
  $effect.pre(() => {
    numberField.value = value;
    numberField.min = min;
    numberField.max = max;
    numberField.step = step > 0 ? step : 1;
    numberField.disabled = disabled;
    numberField.readOnly = readOnly;
    numberField.required = required;
    numberField.name = name;
    numberField.locale = locale;
    numberField.formatOptions = formatOptions;
    if (!numberField.focused) numberField.text = numberField.format(value);
  });
</script>

<div bind:this={ref} {...rest} data-disabled={disabled ? '' : undefined} data-readonly={readOnly ? '' : undefined}>
  {@render children?.()}
</div>
