export class PreviewCardHandle { open = $state(false); toggle() { this.open = !this.open; } close() { this.open = false; } }
export function createPreviewCardHandle() { return new PreviewCardHandle(); }
