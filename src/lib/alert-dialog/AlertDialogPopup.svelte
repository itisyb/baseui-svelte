<script lang="ts">
  import DialogPopup from '../dialog/DialogPopup.svelte';
  import type { DialogPopupProps } from '../dialog/DialogPopup.svelte';
  let props: DialogPopupProps = $props();
</script>

<DialogPopup {...props} role="alertdialog" />
