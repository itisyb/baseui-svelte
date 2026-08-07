import { getToastProviderContext } from './toast-context.svelte.js';
export function useToastManager() { const provider = getToastProviderContext(); return { get toasts() { return provider.toasts; }, add: provider.add.bind(provider), close: provider.close.bind(provider), update: provider.update.bind(provider), promise: provider.promise.bind(provider) }; }
