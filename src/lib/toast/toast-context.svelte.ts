import { createContext } from 'svelte';
import type { ToastManagerPromiseOptions, ToastManagerUpdateOptions, ToastObject } from './create-toast-manager.js';
export class ToastProviderState {
  toasts = $state.raw<ToastObject[]>([]);
  timeout = $state(5000);
  limit = $state(3);
  hovering = $state(false);
  focused = $state(false);
  timers = new Map<string, ReturnType<typeof setTimeout>>();
  add(options: Partial<ToastObject> & { id?: string }): string { const id = options.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`; const existing = this.toasts.find((toast) => toast.id === id); if (existing) return this.update(id, options); const toast: ToastObject = { priority: 'low', timeout: this.timeout, transitionStatus: 'starting', updateKey: 0, ...options, id }; this.toasts = [...this.toasts, toast]; this.applyLimit(); this.schedule(toast); return id; }
  close(id?: string) { if (id) this.remove(id); else for (const toast of [...this.toasts]) this.remove(toast.id); }
  remove(id: string) { const toast = this.toasts.find((item) => item.id === id); if (!toast) return; toast.onClose?.(); this.timers.get(id) && clearTimeout(this.timers.get(id)); this.timers.delete(id); this.toasts = this.toasts.filter((item) => item.id !== id); toast.onRemove?.(); this.applyLimit(); }
  update(id: string, updates: ToastManagerUpdateOptions | Partial<ToastObject>): string { const current = this.toasts.find((toast) => toast.id === id); if (!current) return this.add({ ...updates, id }); this.toasts = this.toasts.map((toast) => toast.id === id ? { ...toast, ...updates, updateKey: (toast.updateKey ?? 0) + 1 } : toast); const updated = this.toasts.find((toast) => toast.id === id)!; this.schedule(updated); return id; }
  promise<Value>(promise: Promise<Value>, options: ToastManagerPromiseOptions<Value>) { const loading = typeof options.loading === 'string' ? { description: options.loading } : options.loading; const id = this.add({ ...loading, timeout: 0 }); promise.then((value) => { const result = typeof options.success === 'function' ? options.success(value) : options.success; this.update(id, typeof result === 'string' ? { description: result, timeout: this.timeout } : result); }, (error) => { const result = typeof options.error === 'function' ? options.error(error) : options.error; this.update(id, typeof result === 'string' ? { description: result, timeout: this.timeout, type: 'error' } : result); }); return promise; }
  schedule(toast: ToastObject) { const existing = this.timers.get(toast.id); if (existing) clearTimeout(existing); const timeout = toast.timeout ?? this.timeout; if (timeout > 0 && !this.hovering && !this.focused) this.timers.set(toast.id, setTimeout(() => this.remove(toast.id), timeout)); }
  resume() { for (const toast of this.toasts) this.schedule(toast); }
  pause() { for (const timer of this.timers.values()) clearTimeout(timer); this.timers.clear(); }
  applyLimit() { const cutoff = Math.max(0, this.toasts.length - this.limit); this.toasts = this.toasts.map((toast, index) => ({ ...toast, limited: index < cutoff })); }
}
export class ToastItemState { toast = $state<ToastObject>({ id: '' }); index = $state(0); }
export const [getToastProviderContext, setToastProviderContext] = createContext<ToastProviderState>();
export const [getToastItemContext, setToastItemContext] = createContext<ToastItemState>();
