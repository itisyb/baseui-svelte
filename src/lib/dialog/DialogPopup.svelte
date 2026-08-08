<script module lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  export interface DialogPopupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet;
    role?: 'dialog' | 'alertdialog';
    initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
    finalFocus?: HTMLElement | (() => HTMLElement | null) | null;
    keepMounted?: boolean;
    closeOnOutsidePress?: boolean;
    closeOnEscape?: boolean;
    ref?: HTMLDivElement | null;
  }

  export type Props = DialogPopupProps;
</script>

<script lang="ts">
  import { composeEventHandlers } from '../shared/events.js';
  import { contains, getFocusable } from '../shared/dom.js';
  import { getDialogContext } from './dialog-context.svelte.js';

  let {
    children,
    role = 'dialog',
    initialFocus,
    finalFocus,
    keepMounted = false,
    closeOnOutsidePress = true,
    closeOnEscape = true,
    ref = $bindable(null),
    onkeydown,
    ...rest
  }: DialogPopupProps = $props();
  const state = getDialogContext();

  function resolveFocus(target: HTMLElement | (() => HTMLElement | null) | null | undefined) {
    return typeof target === 'function' ? target() : target;
  }

  function popupAttachment(node: HTMLDivElement) {
    state.popup = node;
    const portal = node.closest<HTMLElement>('[data-base-ui-portal]');
    const hiddenSiblings: Array<{ element: HTMLElement; inert: boolean; ariaHidden: string | null }> = [];
    const previousOverflow = document.body.style.overflow;

    if (state.modal) {
      document.body.style.overflow = 'hidden';
      if (portal?.parentElement === document.body) {
        for (const sibling of Array.from(document.body.children)) {
          if (!(sibling instanceof HTMLElement) || sibling === portal || sibling.tagName === 'SCRIPT') continue;
          hiddenSiblings.push({ element: sibling, inert: sibling.inert, ariaHidden: sibling.getAttribute('aria-hidden') });
          sibling.inert = true;
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }

    queueMicrotask(() => {
      const preferred = resolveFocus(initialFocus);
      const autofocus = node.querySelector<HTMLElement>('[autofocus]');
      (preferred ?? autofocus ?? getFocusable(node)[0] ?? node).focus({ preventScroll: true });
    });

    function outsidePress(event: PointerEvent) {
      if (!closeOnOutsidePress || contains(node, event.target) || contains(state.trigger, event.target)) return;
      state.setOpen(false, 'outside-press', event);
    }
    document.addEventListener('pointerdown', outsidePress, true);

    return () => {
      document.removeEventListener('pointerdown', outsidePress, true);
      state.popup = null;
      document.body.style.overflow = previousOverflow;
      for (const { element, inert, ariaHidden } of hiddenSiblings) {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute('aria-hidden');
        else element.setAttribute('aria-hidden', ariaHidden);
      }
      const destination = resolveFocus(finalFocus) ?? state.trigger;
      queueMicrotask(() => destination?.focus({ preventScroll: true }));
    };
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
      state.setOpen(false, 'escape-key', event);
      return;
    }
    if (event.key !== 'Tab' || !state.modal || !ref) return;
    const focusable = getFocusable(ref);
    if (focusable.length === 0) {
      event.preventDefault();
      ref.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
</script>

{#if keepMounted || state.open}
  <div
    bind:this={ref}
    {...rest}
    id={state.popupId}
    {role}
    aria-modal={state.modal || undefined}
    aria-labelledby={state.titleMounted ? state.titleId : undefined}
    aria-describedby={state.descriptionMounted ? state.descriptionId : undefined}
    tabindex="-1"
    hidden={!state.open}
    data-open={state.open ? '' : undefined}
    data-closed={!state.open ? '' : undefined}
    onkeydown={composeEventHandlers(onkeydown, handleKeydown)}
    {@attach popupAttachment}
  >
    {@render children?.()}
  </div>
{/if}
