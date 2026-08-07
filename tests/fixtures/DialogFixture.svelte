<script lang="ts">
  import * as Dialog from '../../src/lib/dialog/index.js';
</script>
<Dialog.Root>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop data-testid="backdrop" />
    <Dialog.Popup>
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Description>Change preferences.</Dialog.Description>
      <button>Action</button>
      <Dialog.Close>Close dialog</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
