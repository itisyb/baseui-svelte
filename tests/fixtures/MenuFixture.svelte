<script lang="ts">import * as Menu from '../../src/lib/menu/index.js'; let pinned = $state(false); let selected = $state('none');</script>
<Menu.Root>
  <Menu.Trigger>Actions</Menu.Trigger>
  <Menu.Portal><Menu.Positioner><Menu.Popup>
    <Menu.Item onSelect={() => selected = 'rename'}>Rename</Menu.Item>
    <Menu.CheckboxItem bind:checked={pinned}>Pin<Menu.CheckboxItemIndicator>✓</Menu.CheckboxItemIndicator></Menu.CheckboxItem>
  </Menu.Popup></Menu.Positioner></Menu.Portal>
</Menu.Root>
<output>{selected}:{pinned}</output>
