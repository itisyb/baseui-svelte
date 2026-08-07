import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TabsFixture from './fixtures/TabsFixture.svelte';

describe('Tabs', () => {
  it('implements automatic activation and labelled panels', async () => {
    const user = userEvent.setup();
    render(TabsFixture);
    const one = screen.getByRole('tab', { name: 'One' });
    const two = screen.getByRole('tab', { name: 'Two' });
    expect(screen.getByRole('tabpanel', { name: 'One' })).toHaveTextContent('First panel');
    one.focus();
    await user.keyboard('{ArrowRight}');
    expect(two).toHaveFocus();
    expect(two).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Two' })).toHaveTextContent('Second panel');
  });
});
