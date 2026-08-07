export class PopoverHandle<Payload = unknown> { open = $state(false); payload = $state<Payload | undefined>(); trigger(payload?: Payload) { this.payload = payload; this.open = true; } close() { this.open = false; } }
export function createPopoverHandle<Payload = unknown>() { return new PopoverHandle<Payload>(); }
