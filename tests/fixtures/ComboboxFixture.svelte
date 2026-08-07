<script lang="ts">import * as Combobox from '../../src/lib/combobox/index.js'; let value = $state<unknown>(null); let inputValue = $state('');</script>
<Combobox.Root bind:value bind:inputValue>
  <Combobox.Label>Fruit</Combobox.Label><Combobox.InputGroup><Combobox.Input /><Combobox.Trigger>Toggle</Combobox.Trigger></Combobox.InputGroup>
  <Combobox.Portal><Combobox.Positioner><Combobox.Popup><Combobox.List><Combobox.Item value="Apple">Apple</Combobox.Item><Combobox.Item value="Pear">Pear</Combobox.Item></Combobox.List><Combobox.Empty>Nothing found</Combobox.Empty></Combobox.Popup></Combobox.Positioner></Combobox.Portal>
</Combobox.Root><output>{String(value)}:{inputValue}</output>
