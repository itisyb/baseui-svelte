<script module lang="ts">
  import type { DialogPopupProps } from '../dialog/DialogPopup.svelte';
  export type Props = DialogPopupProps;
</script>

<script lang="ts">
  import DialogPopup from '../dialog/DialogPopup.svelte';
  let props: DialogPopupProps = $props();
</script>

<DialogPopup {...props} role="alertdialog" />
