import { fireEvent, render, screen } from '@testing-library/svelte';
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

  it('keeps a closing panel mounted and exposes Base UI transition state', async () => {
    const user = userEvent.setup();
    render(AccordionFixture);
    const alpha = screen.getByRole('button', { name: 'Alpha' });

    await user.click(alpha);
    const panel = screen.getByRole('region', { name: 'Alpha' });
    expect(panel.style.getPropertyValue('--accordion-panel-height')).toMatch(/px$/);
    expect(panel.style.getPropertyValue('--accordion-panel-width')).toMatch(/px$/);

    await user.click(alpha);
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute('data-ending-style');

    await fireEvent.transitionEnd(panel, { propertyName: 'height' });
    expect(screen.queryByRole('region', { name: 'Alpha' })).not.toBeInTheDocument();
  });
});
