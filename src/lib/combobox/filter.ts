export interface FilterOptions { sensitivity?: Intl.CollatorOptions['sensitivity']; locale?: string | string[]; }
export function useComboboxFilter(options: FilterOptions = {}) {
  const collator = new Intl.Collator(options.locale, { usage: 'search', sensitivity: options.sensitivity ?? 'base' });
  const normalize = (value: unknown) => String(value ?? '');
  return {
    contains(item: unknown, query: string) { const source = normalize(item); if (!query) return true; return Array.from({ length: Math.max(0, source.length - query.length + 1) }, (_, index) => source.slice(index, index + query.length)).some((part) => collator.compare(part, query) === 0); },
    startsWith(item: unknown, query: string) { return collator.compare(normalize(item).slice(0, query.length), query) === 0; },
    endsWith(item: unknown, query: string) { return collator.compare(normalize(item).slice(-query.length), query) === 0; },
  };
}
export function useFilteredItems<T>(items: T[], query: string, filter: (item: T, query: string) => boolean) { return items.filter((item) => filter(item, query)); }
