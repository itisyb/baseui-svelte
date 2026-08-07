<script lang="ts">
  import * as Tabs from '../../src/lib/tabs/index.js';
  let value = $state<string | null>('one');
</script>
<Tabs.Root bind:value>
  <Tabs.List aria-label="Demo tabs">
    <Tabs.Tab value="one">One</Tabs.Tab>
    <Tabs.Tab value="two">Two</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="one">First panel</Tabs.Panel>
  <Tabs.Panel value="two">Second panel</Tabs.Panel>
</Tabs.Root>
<output>{value}</output>
