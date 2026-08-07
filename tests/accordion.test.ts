import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import AccordionFixture from './fixtures/AccordionFixture.svelte';

describe('Accordion', () => {
  it('connects triggers and panels and supports arrow navigation', async () => {
    const user = userEvent.setup();
    render(AccordionFixture);
    const alpha = screen.getByRole('button', { name: 'Alpha' });
    const beta = screen.getByRole('button', { name: 'Beta' });

    expect(alpha).toHaveAttribute('aria-expanded', 'false');
    await user.click(alpha);
    expect(alpha).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Alpha' })).toHaveTextContent('Alpha panel');
    expect(screen.getByText('alpha', { selector: 'output' })).toBeInTheDocument();

    alpha.focus();
    await user.keyboard('{ArrowDown}');
    expect(beta).toHaveFocus();
  });
});
