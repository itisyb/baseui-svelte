import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import FieldFixture from './fixtures/FieldFixture.svelte';

describe('Field', () => {
  it('wires labels, descriptions, native validation, and error messages', async () => {
    const user = userEvent.setup();
    render(FieldFixture);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('Work email only.');
    await user.type(input, 'not-an-email');
    await user.tab();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email.');
  });
});
