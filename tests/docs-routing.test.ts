import { describe, expect, it } from 'vitest';
import { docsPaths, localDocsHref } from '../src/routes/docs-data.server.js';

describe('documentation route manifest', () => {
  it('contains every pinned upstream documentation page exactly once', () => {
    expect(docsPaths).toHaveLength(82);
    expect(new Set(docsPaths).size).toBe(docsPaths.length);
    expect(docsPaths).toContain('components/accordion');
    expect(docsPaths).toContain('overview/releases/v1-7-0');
    expect(docsPaths).toContain('utils/use-render');
  });

  it('builds local documentation links', () => {
    expect(localDocsHref('Components', 'Accordion')).toBe('/svelte/components/accordion');
    expect(localDocsHref('Handbook', 'llms.txt')).toBe('/llms.txt');
    expect(localDocsHref('Utils', 'mergeProps')).toBe('/svelte/utils/merge-props');
  });
});
