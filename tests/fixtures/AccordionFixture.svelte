<script lang="ts">
  import * as Accordion from '../../src/lib/accordion/index.js';
  let value = $state<string | null>(null);
</script>

<Accordion.Root bind:value>
  <Accordion.Item value="alpha">
    <Accordion.Header><Accordion.Trigger>Alpha</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Alpha panel</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="beta">
    <Accordion.Header><Accordion.Trigger>Beta</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel>Beta panel</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
<output>{value ?? 'none'}</output>
