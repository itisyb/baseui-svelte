<script lang="ts">
  import * as Dialog from '$lib/dialog';
  import * as Menu from '$lib/menu';
  import * as Popover from '$lib/popover';
</script>

<div class="popup-demo">
  <Popover.Root>
    <Popover.Trigger class="demo-button">Notifications</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner sideOffset={8}>
        <Popover.Popup class="popover-popup">
          <Popover.Arrow class="popup-arrow" />
          <Popover.Title class="popup-title">Notifications</Popover.Title>
          <Popover.Description class="popup-description">You are all caught up. Good job!</Popover.Description>
          <Popover.Close class="text-button">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>

  <Menu.Root>
    <Menu.Trigger class="demo-button">
      Actions
      <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner sideOffset={8} align="start">
        <Menu.Popup class="menu-popup">
          <Menu.Item class="menu-item">Duplicate</Menu.Item>
          <Menu.Item class="menu-item">Rename</Menu.Item>
          <Menu.Separator class="menu-separator" />
          <Menu.Item class="menu-item danger-item">Delete</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>

  <Dialog.Root>
    <Dialog.Trigger class="demo-button primary-button">Open dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop class="dialog-backdrop" />
      <Dialog.Viewport class="dialog-viewport">
        <Dialog.Popup class="dialog-popup">
          <Dialog.Title class="dialog-title">Publish component?</Dialog.Title>
          <Dialog.Description class="dialog-description">This will make the component available to everyone in your workspace.</Dialog.Description>
          <div class="dialog-actions">
            <Dialog.Close class="demo-button">Cancel</Dialog.Close>
            <Dialog.Close class="demo-button primary-button">Publish</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
</div>
