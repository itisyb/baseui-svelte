import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import NumberFieldFixture from './fixtures/NumberFieldFixture.svelte';

describe('NumberField', () => {
  it('steps with buttons and keyboard and respects bounds', async () => {
    const user = userEvent.setup();
    render(NumberFieldFixture);
    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    await user.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input).toHaveAttribute('aria-valuenow', '3');
    input.focus();
    await user.keyboard('{End}{ArrowUp}');
    expect(input).toHaveAttribute('aria-valuenow', '5');
    expect(screen.getByText('5', { selector: 'output' })).toBeInTheDocument();
  });
});
