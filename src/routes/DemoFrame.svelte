<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as Tabs from '$lib/tabs';

  interface Props {
    id: string;
    source?: string;
    title: string;
    description: string;
    code: string;
    children: Snippet;
  }

  let { id, source = id, title, description, code, children }: Props = $props();
</script>

<section class="component-section" {id}>
  <div class="section-heading">
    <h2>{title}</h2>
    <p>{description}</p>
  </div>

  <Tabs.Root class="demo-root" value="preview">
    <Tabs.Panel class="demo-panel" value="preview">
      <div class="demo-playground">
        {@render children()}
      </div>
    </Tabs.Panel>
    <Tabs.Panel class="code-panel" value="code">
      <pre><code>{code}</code></pre>
    </Tabs.Panel>
    <div class="demo-toolbar">
      <Tabs.List class="demo-tabs" aria-label={`${title} example view`}>
        <Tabs.Tab class="demo-tab" value="preview">Preview</Tabs.Tab>
        <Tabs.Tab class="demo-tab" value="code">Svelte</Tabs.Tab>
      </Tabs.List>
      <a
        class="source-link"
        href={`https://github.com/itisyb/baseui-svelte/tree/main/src/lib/${source}`}
        target="_blank"
        rel="noreferrer"
      >
        Source
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5.5 3.5h7v7M12 4 4 12" /></svg>
      </a>
    </div>
  </Tabs.Root>
</section>
