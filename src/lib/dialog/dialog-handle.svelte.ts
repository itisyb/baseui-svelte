export class DialogHandle<Payload = unknown> { open = $state(false); payload = $state<Payload | undefined>(); trigger(payload?: Payload) { this.payload = payload; this.open = true; } close() { this.open = false; } }
export function createDialogHandle<Payload = unknown>() { return new DialogHandle<Payload>(); }
