<script lang="ts">
  import * as CheckboxGroup from '../../src/lib/checkbox-group/index.js';
  import * as Checkbox from '../../src/lib/checkbox/index.js';
  let value = $state<string[]>([]);
</script>
<CheckboxGroup.Root bind:value name="fruit">
  <Checkbox.Root value="apple">Apple</Checkbox.Root>
  <Checkbox.Root value="pear">Pear</Checkbox.Root>
</CheckboxGroup.Root>
<output>{value.join(',')}</output>
