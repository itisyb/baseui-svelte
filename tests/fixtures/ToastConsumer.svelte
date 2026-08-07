<script lang="ts">import * as Toast from '../../src/lib/toast/index.js'; const manager = Toast.useToastManager();</script>
<button onclick={() => manager.add({ title: 'Saved', description: 'Your changes were saved.', timeout: 0 })}>Notify</button>
<Toast.Viewport>{#each manager.toasts as toast (toast.id)}<Toast.Root {toast}><Toast.Content><Toast.Title /><Toast.Description /></Toast.Content><Toast.Close>Dismiss</Toast.Close></Toast.Root>{/each}</Toast.Viewport>
