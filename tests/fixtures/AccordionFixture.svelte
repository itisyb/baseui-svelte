<script lang="ts">
  import * as Accordion from '../../src/lib/accordion/index.js';
  let value = $state<string | null>(null);
</script>

<Accordion.Root bind:value>
  <Accordion.Item value="alpha">
    <Accordion.Header><Accordion.Trigger>Alpha</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel class="Panel">Alpha panel</Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item value="beta">
    <Accordion.Header><Accordion.Trigger>Beta</Accordion.Trigger></Accordion.Header>
    <Accordion.Panel class="Panel">Beta panel</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>

<style>
  :global(.Panel) {
    height: var(--accordion-panel-height);
    overflow: hidden;
    transition: height 150ms ease-out;
  }

  :global(.Panel[data-starting-style]),
  :global(.Panel[data-ending-style]) {
    height: 0;
  }
</style>
<output>{value ?? 'none'}</output>
