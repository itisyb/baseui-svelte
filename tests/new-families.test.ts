import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import MenuFixture from './fixtures/MenuFixture.svelte';
import ContextMenuFixture from './fixtures/ContextMenuFixture.svelte';
import ComboboxFixture from './fixtures/ComboboxFixture.svelte';
import DrawerFixture from './fixtures/DrawerFixture.svelte';
import NavigationMenuFixture from './fixtures/NavigationMenuFixture.svelte';
import PreviewCardFixture from './fixtures/PreviewCardFixture.svelte';
import ToastFixture from './fixtures/ToastFixture.svelte';

describe('remaining component families', () => {
  it('supports menu actions and persistent checkbox items', async () => { const user = userEvent.setup(); render(MenuFixture); await user.click(screen.getByRole('button', { name: 'Actions' })); await user.click(screen.getByRole('menuitemcheckbox', { name: /Pin/ })); expect(screen.getByRole('menu')).toBeInTheDocument(); expect(screen.getByText('none:true', { selector: 'output' })).toBeInTheDocument(); await user.click(screen.getByRole('menuitem', { name: 'Rename' })); expect(screen.queryByRole('menu')).not.toBeInTheDocument(); });
  it('opens a context menu at a right click', async () => { render(ContextMenuFixture); await fireEvent.contextMenu(screen.getByText('Canvas'), { clientX: 20, clientY: 30 }); expect(screen.getByRole('menu')).toBeInTheDocument(); await fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' })); expect(screen.getByText('copy', { selector: 'output' })).toBeInTheDocument(); });
  it('filters and selects combobox options', async () => { const user = userEvent.setup(); render(ComboboxFixture); const input = screen.getByRole('combobox', { name: 'Fruit' }); await user.type(input, 'pe'); expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument(); await user.click(screen.getByRole('option', { name: 'Pear' })); expect(input).toHaveValue('Pear'); expect(screen.getByText('Pear:Pear', { selector: 'output' })).toBeInTheDocument(); });
  it('opens and closes a drawer with dialog semantics', async () => { const user = userEvent.setup(); render(DrawerFixture); await user.click(screen.getByRole('button', { name: 'Open drawer' })); expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument(); await user.click(screen.getByRole('button', { name: 'Close drawer' })); expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); });
  it('switches navigation menu content', async () => { const user = userEvent.setup(); render(NavigationMenuFixture); await user.click(screen.getByRole('button', { name: 'Products' })); expect(screen.getByRole('link', { name: 'Product one' })).toBeInTheDocument(); expect(screen.getByText('products', { selector: 'output' })).toBeInTheDocument(); });
  it('opens a preview card on hover', async () => { const user = userEvent.setup(); render(PreviewCardFixture); await user.hover(screen.getByRole('link', { name: 'Ada' })); expect(await screen.findByText('Ada Lovelace profile')).toBeInTheDocument(); });
  it('creates and dismisses toast notifications', async () => { const user = userEvent.setup(); render(ToastFixture); await user.click(screen.getByRole('button', { name: 'Notify' })); expect(screen.getByRole('status')).toHaveTextContent('Saved'); await user.click(screen.getByRole('button', { name: 'Dismiss' })); expect(screen.queryByRole('status')).not.toBeInTheDocument(); });
});
