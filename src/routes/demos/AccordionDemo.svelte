<script lang="ts">
  import * as Accordion from '$lib/accordion';
</script>

<Accordion.Root class="accordion-demo" value="accessibility">
  <Accordion.Item class="accordion-item" value="accessibility">
    <Accordion.Header class="accordion-header">
      <Accordion.Trigger class="accordion-trigger">
        What makes Base UI accessible?
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel class="accordion-panel">
      <p>Components follow WAI-ARIA patterns and include keyboard navigation, focus management, and screen-reader semantics.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item class="accordion-item" value="styling">
    <Accordion.Header class="accordion-header">
      <Accordion.Trigger class="accordion-trigger">
        How do I style components?
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel class="accordion-panel">
      <p>Use plain CSS, Tailwind, CSS Modules, or any styling system. Every part exposes classes and state data attributes.</p>
    </Accordion.Panel>
  </Accordion.Item>
  <Accordion.Item class="accordion-item" value="svelte">
    <Accordion.Header class="accordion-header">
      <Accordion.Trigger class="accordion-trigger">
        Is this native Svelte 5?
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel class="accordion-panel">
      <p>Yes. The port uses runes, snippets, bindable props, typed context, and attachments throughout.</p>
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
