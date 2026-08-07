<script lang="ts">
  import * as Select from '../../src/lib/select/index.js';
  let value = $state<string | null>(null);
</script>
<Select.Root bind:value>
  <Select.Label>Fruit</Select.Label>
  <Select.Trigger><Select.Value placeholder="Choose fruit" /></Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.List>
          <Select.Item value="apple" label="Apple"><Select.ItemText /></Select.Item>
          <Select.Item value="pear" label="Pear"><Select.ItemText /></Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
<output>{value ?? 'none'}</output>
