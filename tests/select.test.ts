import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SelectFixture from './fixtures/SelectFixture.svelte';

describe('Select', () => {
  it('opens from the keyboard and selects the highlighted option', async () => {
    const user = userEvent.setup();
    render(SelectFixture);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox', { name: 'Fruit' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Pear');
    expect(screen.getByText('pear', { selector: 'output' })).toBeInTheDocument();
  });
});
