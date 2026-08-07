import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CheckboxGroupFixture from './fixtures/CheckboxGroupFixture.svelte';

describe('CheckboxGroup', () => {
  it('coordinates checkbox values and form inputs', async () => {
    const user = userEvent.setup();
    render(CheckboxGroupFixture);
    const apple = screen.getByRole('checkbox', { name: 'Apple' });
    await user.click(apple);
    expect(apple).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('apple', { selector: 'output' })).toBeInTheDocument();
    expect(document.querySelector('input[name="fruit"][value="apple"]')).toBeChecked();
  });
});
