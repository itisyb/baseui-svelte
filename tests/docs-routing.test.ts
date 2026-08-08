import { describe, expect, it } from 'vitest';
import { docsPaths, localDocsHref, translateDemoSource } from '../src/routes/docs-data.server.js';

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

  it('dedents translated demo source', () => {
    const source = `import { Avatar } from '@base-ui/react/avatar';
import styles from './index.module.css';

export default function ExampleAvatar() {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Avatar.Root className={styles.Root}>
        <Avatar.Image
          src="https://example.com/avatar.png"
          width="48"
          height="48"
          className={styles.Image}
        />
        <Avatar.Fallback delay={600} className={styles.Fallback}>
          LT
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}`;

    const translated = translateDemoSource(source);

    expect(translated).toContain(
      `<div style={{ display: 'flex', gap: '1rem' }}>\n  <Avatar.Root class="Root">\n    <Avatar.Image\n      src="https://example.com/avatar.png"`,
    );
  });
});
