<script lang="ts">
  import DemoFrame from './DemoFrame.svelte';
  import AccordionDemo from './demos/AccordionDemo.svelte';
  import ControlsDemo from './demos/ControlsDemo.svelte';
  import PopupDemo from './demos/PopupDemo.svelte';
  import SelectDemo from './demos/SelectDemo.svelte';

  const componentGroups = [
    {
      label: 'Form',
      components: ['Checkbox', 'Checkbox Group', 'Field', 'Fieldset', 'Form', 'Input', 'Number Field', 'OTP Field', 'Radio', 'Radio Group', 'Select', 'Slider', 'Switch'],
    },
    {
      label: 'Navigation',
      components: ['Accordion', 'Collapsible', 'Menu', 'Menubar', 'Navigation Menu', 'Tabs', 'Toolbar'],
    },
    {
      label: 'Overlay',
      components: ['Alert Dialog', 'Context Menu', 'Dialog', 'Drawer', 'Popover', 'Preview Card', 'Toast', 'Tooltip'],
    },
    {
      label: 'Other',
      components: ['Autocomplete', 'Avatar', 'Button', 'Combobox', 'Meter', 'Progress', 'Scroll Area', 'Separator', 'Toggle', 'Toggle Group', 'Portal', 'Direction Provider', 'CSP Provider'],
    },
  ] as const;

  const code = {
    accordion: `<script lang="ts">
  import * as Accordion from '@base-ui/svelte/accordion';
<\/script>

<Accordion.Root value="accessibility">
  <Accordion.Item value="accessibility">
    <Accordion.Header>
      <Accordion.Trigger>What makes Base UI accessible?</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>
      Components follow WAI-ARIA patterns and include keyboard navigation.
    </Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>`,
    controls: `<script lang="ts">
  import * as Switch from '@base-ui/svelte/switch';
  import * as Slider from '@base-ui/svelte/slider';

  let enabled = $state(true);
  let volume = $state(64);
<\/script>

<Switch.Root bind:checked={enabled} aria-label="Product updates">
  <Switch.Thumb />
</Switch.Root>

<Slider.Root bind:value={volume}>
  <Slider.Label>Volume</Slider.Label>
  <Slider.Control>
    <Slider.Track><Slider.Indicator /></Slider.Track>
    <Slider.Thumb />
  </Slider.Control>
</Slider.Root>`,
    select: `<script lang="ts">
  import * as Select from '@base-ui/svelte/select';
  let value = $state<string | null>('svelte');
<\/script>

<Select.Root bind:value>
  <Select.Label>Framework</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Select a framework" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.List>
          <Select.Item value="svelte" label="Svelte">
            <Select.ItemIndicator>✓</Select.ItemIndicator>
            <Select.ItemText />
          </Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>`,
    popover: `<script lang="ts">
  import * as Popover from '@base-ui/svelte/popover';
<\/script>

<Popover.Root>
  <Popover.Trigger>Notifications</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner sideOffset={8}>
      <Popover.Popup>
        <Popover.Arrow />
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>You are all caught up.</Popover.Description>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover.Root>`,
  };

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;

  function slug(name: string) {
    return name.toLowerCase().replaceAll(' ', '-');
  }

  async function copyInstall() {
    await navigator.clipboard.writeText('npm install github:itisyb/baseui-svelte @floating-ui/dom');
    copied = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied = false), 1800);
  }
</script>

<svelte:head>
  <title>Base UI for Svelte 5</title>
  <meta name="description" content="An unstyled, accessible Svelte 5 port of Base UI with all component families and native Svelte APIs." />
  <meta property="og:title" content="Base UI for Svelte 5" />
  <meta property="og:description" content="Unstyled UI components for building accessible Svelte interfaces." />
</svelte:head>

<a class="skip-link" href="#main-content">Skip to content</a>

<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/" aria-label="Base UI for Svelte home">
      <svg class="brand-mark" aria-hidden="true" width="17" height="24" viewBox="0 0 17 24" fill="currentColor">
        <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
        <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
      </svg>
      <span>Base UI</span>
      <span class="brand-divider" aria-hidden="true">/</span>
      <span class="brand-port">Svelte</span>
    </a>
    <nav class="header-nav" aria-label="Primary navigation">
      <a href="#quick-start">Quick start</a>
      <a href="#components">Components</a>
      <a class="github-link" href="https://github.com/itisyb/baseui-svelte" target="_blank" rel="noreferrer">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.4a9.75 9.75 0 0 0-3.08 19c.49.09.67-.21.67-.47v-1.71c-2.73.59-3.31-1.16-3.31-1.16-.45-1.14-1.09-1.44-1.09-1.44-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.88 1.5 2.3 1.07 2.86.82.09-.63.34-1.07.62-1.32-2.18-.25-4.47-1.09-4.47-4.83 0-1.07.38-1.94 1.01-2.63-.1-.25-.44-1.24.1-2.59 0 0 .82-.26 2.68 1a9.3 9.3 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.35.2 2.34.1 2.59.63.69 1.01 1.56 1.01 2.63 0 3.75-2.3 4.58-4.48 4.82.35.31.66.91.66 1.83v2.72c0 .26.18.57.67.47A9.75 9.75 0 0 0 12 2.4Z" fill="currentColor" /></svg>
        <span>GitHub</span>
      </a>
    </nav>
  </div>
</header>

<div class="page-shell">
  <aside class="side-nav" aria-label="Component navigation">
    <nav>
      <a class="overview-link" href="#main-content">Overview</a>
      {#each componentGroups as group}
        <div class="nav-group">
          <h2>{group.label}</h2>
          <ul>
            {#each group.components as component}
              <li>
                <a href={`https://github.com/itisyb/baseui-svelte/tree/main/src/lib/${slug(component)}`} target="_blank" rel="noreferrer">{component}</a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </nav>
  </aside>

  <main id="main-content">
    <section class="hero">
      <div class="eyebrow"><span class="status-dot"></span>Svelte 5 port · 40 components + CSP</div>
      <h1>Base UI for Svelte</h1>
      <p class="hero-subtitle">Unstyled UI components for building accessible user interfaces with Svelte&nbsp;5.</p>
      <div class="hero-actions">
        <a class="hero-button primary-button" href="#quick-start">Get started</a>
        <a class="hero-button" href="https://github.com/itisyb/baseui-svelte" target="_blank" rel="noreferrer">View on GitHub</a>
      </div>
    </section>

    <div class="feature-grid" aria-label="Library qualities">
      <div>
        <span class="feature-index">01</span>
        <h2>Headless</h2>
        <p>No bundled styles and no visual opinions. Bring plain CSS, Tailwind, or your own system.</p>
      </div>
      <div>
        <span class="feature-index">02</span>
        <h2>Accessible</h2>
        <p>Keyboard behavior, focus management, and WAI-ARIA semantics are built into each primitive.</p>
      </div>
      <div>
        <span class="feature-index">03</span>
        <h2>Svelte-native</h2>
        <p>Runes, snippets, bindable state, typed context, and <code>{'{@attach}'}</code>—not a React compatibility layer.</p>
      </div>
    </div>

    <section class="quick-start" id="quick-start">
      <div class="section-heading">
        <h2>Quick start</h2>
        <p>Install the package, import a component namespace, and assemble only the parts you need.</p>
      </div>
      <div class="install-block">
        <div class="install-topbar">
          <span>npm</span>
          <button class="copy-button" type="button" onclick={copyInstall} aria-label="Copy install command">
            {#if copied}
              <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
              Copied
            {:else}
              <svg aria-hidden="true" viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="7" height="7" rx="1" /><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></svg>
              Copy
            {/if}
          </button>
        </div>
        <pre><code><span class="prompt">$</span> npm install github:itisyb/baseui-svelte @floating-ui/dom</code></pre>
        <div class="sr-status" role="status" aria-live="polite">{copied ? 'Install command copied' : ''}</div>
      </div>
    </section>

    <section id="components" class="examples-intro">
      <div class="section-heading">
        <h2>Components</h2>
        <p>These are live examples rendered by the Svelte port. Use a mouse, keyboard, or touch to try them.</p>
      </div>
    </section>

    <DemoFrame id="accordion" title="Accordion" description="A vertically stacked set of interactive headings that reveal content." code={code.accordion}>
      <AccordionDemo />
    </DemoFrame>

    <DemoFrame id="controls" source="switch" title="Form controls" description="Switch, Checkbox, Slider, and Number Field composed into one settings panel." code={code.controls}>
      <ControlsDemo />
    </DemoFrame>

    <DemoFrame id="select" title="Select" description="A popup listbox for choosing a single value, with complete keyboard navigation." code={code.select}>
      <SelectDemo />
    </DemoFrame>

    <DemoFrame id="popover" title="Popup primitives" description="Popover, Menu, and Dialog demonstrate positioning, portals, dismissal, and focus management." code={code.popover}>
      <PopupDemo />
    </DemoFrame>

    <section class="component-index" id="all-components">
      <div class="section-heading">
        <h2>Complete component set</h2>
        <p>All 40 Base UI component families are present, plus the CSP Provider utility.</p>
      </div>
      <div class="component-groups">
        {#each componentGroups as group}
          <section>
            <h3>{group.label}</h3>
            <ul>
              {#each group.components as component}
                <li>
                  <a href={`https://github.com/itisyb/baseui-svelte/tree/main/src/lib/${slug(component)}`} target="_blank" rel="noreferrer">
                    {component}
                    <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5.5 3.5h7v7M12 4 4 12" /></svg>
                  </a>
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
    </section>

    <footer>
      <p>Base UI for Svelte is an independent Svelte 5 port of MUI Base UI.</p>
      <div>
        <a href="https://github.com/itisyb/baseui-svelte" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://base-ui.com" target="_blank" rel="noreferrer">Original Base UI</a>
      </div>
    </footer>
  </main>
</div>
