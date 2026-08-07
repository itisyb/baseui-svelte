# Base UI for Svelte

An independent Svelte 5 port of [MUI Base UI](https://github.com/mui/base-ui): unstyled, accessible primitives that give applications complete control over markup-adjacent styling.

The port covers all 40 upstream component families and every named component part in the `@base-ui/react` 1.7.0 package. React-specific concepts are translated to Svelte-native bindings, snippets, context, and attachments; see [port status](./docs/port-status.md) for the parity definition.

## Install

```sh
npm install @base-ui/svelte @floating-ui/dom
```

The package requires Svelte 5.40 or newer. It ships no CSS.

## Usage

Components use the same compound naming style as Base UI, adapted to Svelte bindings and snippets.

```svelte
<script lang="ts">
  import { Accordion } from '@base-ui/svelte';

  let value = $state<string | null>('account');
</script>

<Accordion.Root bind:value>
  <Accordion.Item value="account">
    <Accordion.Header>
      <Accordion.Trigger>Account</Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel>Account settings</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>
```

Every stateful root supports a bindable value (`bind:value`, `bind:open`, `bind:checked`, or `bind:pressed`) and a callback carrying a reason and original event:

```svelte
<Switch.Root
  bind:checked
  onCheckedChange={(next, details) => {
    console.log(next, details.reason, details.event);
  }}
>
  <Switch.Thumb />
</Switch.Root>
```

Subpath imports are available when that better fits an application's bundler:

```ts
import * as Dialog from '@base-ui/svelte/dialog';
```

### Dialog

```svelte
<Dialog.Root bind:open>
  <Dialog.Trigger>Edit profile</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop class="backdrop" />
    <Dialog.Popup class="popup">
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>Update the public details on your profile.</Dialog.Description>
      <!-- fields -->
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

Dialog supplies focus trapping, outside-press and Escape handling, scroll locking, focus restoration, stable ARIA relationships, and modal sibling isolation. Styling and animation remain application concerns.

### Select

```svelte
<Select.Root bind:value name="fruit">
  <Select.Label>Fruit</Select.Label>
  <Select.Trigger>
    <Select.Value placeholder="Choose fruit" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner sideOffset={8}>
      <Select.Popup>
        <Select.List>
          <Select.Item value="apple" label="Apple"><Select.ItemText /></Select.Item>
          <Select.Item value="pear" label="Pear"><Select.ItemText /></Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

## Styling

Parts forward ordinary element attributes and expose state through attributes such as `data-open`, `data-checked`, `data-selected`, `data-disabled`, `data-orientation`, `data-side`, and `data-align`.

```css
.trigger[data-open] {
  background: oklch(94% 0.02 260);
}

.panel[data-open] {
  animation: reveal 160ms ease-out;
}
```

Slider and progress parts also expose CSS custom properties, including `--slider-thumb-position`, `--slider-indicator-start`, `--slider-indicator-end`, and `--progress-value`.

## Svelte 5 conventions

- Runes and reactive context classes; no legacy `$:` statements or component event dispatchers.
- Explicit `$bindable` state props and callback props.
- Snippets instead of slots.
- `$props.id()` for hydration-safe relationships.
- Attachments for portals and DOM lifecycle integration.
- Native controls where they provide the strongest semantics; ARIA composites where compound behavior requires them.
- Consumer handlers run first, and `preventDefault()` cancels internal behavior.

The design rationale is documented in [architecture.md](./docs/architecture.md).

## Development

```sh
npm install
npm run validate
```

`validate` runs Svelte diagnostics, interaction tests, package generation, and package export linting.

## Attribution

This project follows the public API concepts and accessibility goals of MUI Base UI, which is MIT licensed. It is an independent Svelte implementation and is not an official MUI package.
