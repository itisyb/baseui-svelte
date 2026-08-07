import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import DialogFixture from './fixtures/DialogFixture.svelte';

describe('Dialog', () => {
  it('moves to a portal, labels itself, traps focus, and closes with Escape', async () => {
    const user = userEvent.setup();
    render(DialogFixture);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAccessibleDescription('Change preferences.');
    expect(dialog.closest('[data-base-ui-portal]')?.parentElement).toBe(document.body);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
