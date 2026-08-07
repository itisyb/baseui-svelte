<script lang="ts">
  import * as NumberField from '../../src/lib/number-field/index.js';
  let value = $state<number | null>(2);
</script>
<NumberField.Root bind:value min={0} max={5}>
  <NumberField.Group>
    <NumberField.Decrement>Decrease</NumberField.Decrement>
    <NumberField.Input aria-label="Quantity" />
    <NumberField.Increment>Increase</NumberField.Increment>
  </NumberField.Group>
</NumberField.Root>
<output>{value}</output>
