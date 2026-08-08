<script lang="ts">
  import { onMount } from 'svelte';
  import DocsNavigation from './DocsNavigation.svelte';

  interface Data {
    components: readonly string[];
    html: string;
    markdown: string;
    path: string;
    title: string;
    headings: readonly { depth: number; id: string; text: string }[];
  }

  let { data }: { data: Data } = $props();

  const overview = ['Quick start', 'Accessibility', 'Releases', 'Community', 'About'];
  const handbook = ['Styling', 'Animation', 'Composition', 'Customization', 'Forms', 'TypeScript', 'llms.txt'];
  const utils = ['CSP Provider', 'Direction Provider', 'mergeProps', 'useRender'];
  let shortcutPrefix = $state('⌘');
  let navigationOpen = $state(false);
  let navigationMode = $state<'desktop' | 'mobile'>('desktop');
  let navigationTrigger = $state<HTMLButtonElement | null>(null);
  let desktopTrigger: HTMLButtonElement;
  let mobileTrigger: HTMLButtonElement;

  function slug(value: string) {
    if (value === 'About') return 'about';
    if (value === 'llms.txt') return 'llms.txt';
    if (value === 'mergeProps') return 'merge-props';
    if (value === 'useRender') return 'use-render';
    return value.toLowerCase().replaceAll(' ', '-');
  }

  function docsHref(section: string, item: string) {
    if (item === 'llms.txt') return '/llms.txt';
    return `/svelte/${section}/${slug(item)}`;
  }

  onMount(() => {
    shortcutPrefix = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘' : 'Ctrl+';
  });

  function openNavigation(mode: 'desktop' | 'mobile', trigger: HTMLButtonElement) {
    navigationMode = mode;
    navigationTrigger = trigger;
    navigationOpen = true;
  }

  function keyboardShortcuts() {
    function keydown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      event.preventDefault();
      const desktop = window.matchMedia('(min-width: 64rem)').matches;
      openNavigation(desktop ? 'desktop' : 'mobile', desktop ? desktopTrigger : mobileTrigger);
    }

    window.addEventListener('keydown', keydown, { capture: true });
    return () => window.removeEventListener('keydown', keydown, { capture: true });
  }

  function enhanceDemos(article: HTMLElement) {
    function activateInstallationTab(tab: HTMLButtonElement) {
      const block = tab.closest<HTMLElement>('[data-installation-block]');
      if (!block) return;
      const value = tab.dataset.value;
      for (const candidate of block.querySelectorAll<HTMLButtonElement>('[role="tab"]')) {
        const active = candidate === tab;
        candidate.toggleAttribute('data-active', active);
        candidate.setAttribute('aria-selected', String(active));
        candidate.tabIndex = active ? 0 : -1;
      }
      for (const panel of block.querySelectorAll<HTMLElement>('[role="tabpanel"]')) {
        panel.hidden = panel.dataset.value !== value;
      }
    }

    function setDemoPanelOpen(
      trigger: HTMLElement,
      popup: HTMLElement,
      group: HTMLElement | null,
      open: boolean,
    ) {
      if (open) {
        popup.removeAttribute('data-ending-style');
        popup.setAttribute('data-starting-style', '');
        popup.hidden = false;
      }
      popup.style.setProperty('--accordion-panel-height', `${popup.scrollHeight}px`);
      popup.style.setProperty('--accordion-panel-width', `${popup.scrollWidth}px`);
      popup.toggleAttribute('data-open', open);
      popup.toggleAttribute('data-closed', !open);
      trigger.toggleAttribute('data-panel-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      group?.toggleAttribute('data-open', open);

      if (open) {
        requestAnimationFrame(() => requestAnimationFrame(() => popup.removeAttribute('data-starting-style')));
        return;
      }

      popup.removeAttribute('data-starting-style');
      void popup.offsetHeight;
      popup.setAttribute('data-ending-style', '');
      const finish = () => {
        if (trigger.getAttribute('aria-expanded') === 'true') return;
        popup.hidden = true;
        popup.removeAttribute('data-ending-style');
      };
      popup.addEventListener('transitionend', finish, { once: true });
      window.setTimeout(finish, 200);
    }

    function setDemoOverlayOpen(trigger: HTMLElement, popup: HTMLElement, open: boolean) {
      const componentRoot = trigger.closest<HTMLElement>('[data-demo-part="Root"]');
      const boundary = componentRoot ?? trigger.closest<HTMLElement>('.DemoPreview');
      const layers: HTMLElement[] = [];
      let parent = popup.parentElement;
      while (parent && parent !== boundary) {
        if (/^(Portal|Positioner|Viewport)$/.test(parent.dataset.demoPart ?? '')) layers.push(parent);
        parent = parent.parentElement;
      }
      const backdrop = boundary?.querySelector<HTMLElement>('[data-demo-part="Backdrop"]');
      if (open) {
        for (const layer of layers.reverse()) layer.hidden = false;
        if (backdrop) {
          backdrop.hidden = false;
          backdrop.toggleAttribute('data-open', true);
        }
        const positioner = popup.closest<HTMLElement>('[data-demo-part="Positioner"]');
        if (positioner) {
          const rect = trigger.getBoundingClientRect();
          const sideOffset = Number(positioner.getAttribute('sideoffset') ?? 4);
          positioner.style.setProperty('--anchor-width', `${rect.width}px`);
          positioner.style.setProperty('--available-height', `${Math.max(160, window.innerHeight - rect.bottom - 24)}px`);
          positioner.style.position = 'fixed';
          const selectPopup = popup.dataset.demoComponent === 'Select.Popup';
          positioner.style.left = `${selectPopup ? rect.left - 26 : rect.left}px`;
          positioner.style.top = `${selectPopup ? rect.top - 4 : rect.bottom + sideOffset}px`;
          positioner.style.zIndex = '30';
          if (selectPopup) {
            popup.setAttribute('data-side', 'none');
            popup.setAttribute('data-align', 'center');
            popup.querySelector<HTMLElement>('[data-demo-part="Item"]')?.setAttribute('data-highlighted', '');
          }
        }
      }
      setDemoPanelOpen(trigger, popup, componentRoot, open);
      if (!open) {
        backdrop?.toggleAttribute('data-open', false);
        window.setTimeout(() => {
          if (trigger.getAttribute('aria-expanded') === 'true') return;
          for (const layer of layers) layer.hidden = true;
          if (backdrop) backdrop.hidden = true;
        }, 200);
      }
    }

    function setDemoFile(root: HTMLElement, tab: HTMLElement) {
      const variant = root.dataset.selectedVariant;
      const file = tab.dataset.demoFile;
      if (!variant || !file) return;
      const tabList = tab.closest('[role="tablist"]');
      for (const candidate of tabList?.querySelectorAll<HTMLElement>('[role="tab"]') ?? []) {
        const active = candidate === tab;
        candidate.toggleAttribute('data-active', active);
        candidate.setAttribute('aria-selected', String(active));
        candidate.tabIndex = active ? 0 : -1;
      }
      for (const panel of root.querySelectorAll<HTMLElement>('[data-demo-code-variant]')) {
        panel.hidden = panel.dataset.demoCodeVariant !== variant || panel.dataset.demoCodeFile !== file;
      }
      root.classList.add('DemoCodeExpanded');
      const showCode = root.querySelector<HTMLElement>('.DemoShowCode .DemoCollapseButtonVisual');
      if (showCode) showCode.textContent = 'Hide code';
    }

    function setDemoVariant(root: HTMLElement, option: HTMLElement) {
      const variant = option.dataset.demoVariantOption;
      if (!variant) return;
      root.dataset.selectedVariant = variant;
      for (const preview of root.querySelectorAll<HTMLElement>('[data-demo-variant]')) {
        preview.hidden = preview.dataset.demoVariant !== variant;
      }
      for (const tabList of root.querySelectorAll<HTMLElement>('[data-demo-variant-tabs]')) {
        tabList.hidden = tabList.dataset.demoVariantTabs !== variant;
      }
      for (const candidate of root.querySelectorAll<HTMLElement>('[data-demo-variant-option]')) {
        candidate.setAttribute('aria-selected', String(candidate.dataset.demoVariantOption === variant));
      }
      for (const trigger of root.querySelectorAll<HTMLElement>('[data-demo-action="variant"]')) {
        const label = trigger.querySelector('span');
        if (label) label.textContent = option.textContent?.trim() ?? '';
        trigger.setAttribute('aria-expanded', 'false');
      }
      for (const popup of root.querySelectorAll<HTMLElement>('.DemoVariantPopup')) popup.hidden = true;
      const firstTab = root.querySelector<HTMLElement>(`[data-demo-variant-tabs="${variant}"] [role="tab"]`);
      if (firstTab) setDemoFile(root, firstTab);
    }

    function closeDemoPopups(root: HTMLElement, except?: HTMLElement) {
      for (const popup of root.querySelectorAll<HTMLElement>('.DemoVariantPopup, .DemoMorePopup')) {
        if (popup === except) continue;
        popup.hidden = true;
        const trigger = popup.parentElement?.querySelector<HTMLElement>('[aria-expanded]');
        trigger?.setAttribute('aria-expanded', 'false');
      }
    }

    function setChecked(control: HTMLElement, checked: boolean) {
      control.setAttribute('aria-checked', String(checked));
      control.toggleAttribute('data-checked', checked);
      control.toggleAttribute('data-unchecked', !checked);
      const indicator = control.querySelector<HTMLElement>('[data-demo-part="Indicator"]');
      if (indicator) indicator.hidden = !checked;
    }

    function selectDemoTab(tab: HTMLElement) {
      const root = tab.closest<HTMLElement>('[data-demo-component="Tabs.Root"]');
      if (!root) return;
      const value = tab.getAttribute('value');
      for (const candidate of root.querySelectorAll<HTMLElement>('[data-demo-component="Tabs.Tab"]')) {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.toggleAttribute('data-selected', selected);
        candidate.tabIndex = selected ? 0 : -1;
      }
      for (const panel of root.querySelectorAll<HTMLElement>('[data-demo-component="Tabs.Panel"]')) {
        const selected = panel.getAttribute('value') === value;
        panel.hidden = !selected;
        panel.toggleAttribute('data-selected', selected);
      }
    }

    function initializeDemoMarkup() {
      for (const control of article.querySelectorAll<HTMLElement>('[data-demo-component="Checkbox.Root"], [data-demo-component="Switch.Root"], [data-demo-component="Radio.Root"]')) {
        if (control.hasAttribute('data-demo-initialized')) continue;
        setChecked(control, control.hasAttribute('checked') || control.hasAttribute('defaultchecked'));
        control.setAttribute('data-demo-initialized', '');
      }

      for (const toggle of article.querySelectorAll<HTMLElement>('[data-demo-component="Toggle"]')) {
        if (toggle.hasAttribute('data-demo-initialized')) continue;
        const pressed = toggle.hasAttribute('pressed') || toggle.hasAttribute('defaultpressed');
        toggle.setAttribute('aria-pressed', String(pressed));
        toggle.toggleAttribute('data-pressed', pressed);
        toggle.setAttribute('data-demo-initialized', '');
      }

      for (const tabsRoot of article.querySelectorAll<HTMLElement>('[data-demo-component="Tabs.Root"]')) {
        const value = tabsRoot.getAttribute('value') ?? tabsRoot.getAttribute('defaultvalue');
        const tab = value
          ? tabsRoot.querySelector<HTMLElement>(`[data-demo-component="Tabs.Tab"][value="${CSS.escape(value)}"]`)
          : tabsRoot.querySelector<HTMLElement>('[data-demo-component="Tabs.Tab"]');
        if (tab && !tabsRoot.querySelector('[data-demo-component="Tabs.Tab"][aria-selected="true"]')) selectDemoTab(tab);
      }

      for (const trigger of article.querySelectorAll<HTMLElement>('.DemoPreview [data-demo-part="Trigger"]')) {
        if (!trigger.hasAttribute('aria-expanded')) trigger.setAttribute('aria-expanded', 'false');
        const item = trigger.closest<HTMLElement>('[data-demo-part="Item"]') ?? trigger.parentElement;
        if (!trigger.hasAttribute('data-panel-open')) item?.toggleAttribute('data-open', false);
      }

      for (const value of article.querySelectorAll<HTMLElement>('.DemoPreview [data-demo-part="Value"]')) {
        if (value.textContent?.trim()) continue;
        const root = value.closest<HTMLElement>('[data-demo-part="Root"]');
        const defaultValue = root?.getAttribute('defaultvalue');
        if (defaultValue) value.textContent = defaultValue;
      }

      for (const indicator of article.querySelectorAll<HTMLElement>('.DemoPreview [data-demo-part="ItemIndicator"]')) {
        const item = indicator.closest<HTMLElement>('[data-demo-part="Item"]');
        indicator.hidden = !item?.hasAttribute('data-selected');
      }

      for (const arrow of article.querySelectorAll<HTMLElement>('.DemoPreview [data-demo-part="ScrollUpArrow"], .DemoPreview [data-demo-part="ScrollDownArrow"]')) {
        arrow.hidden = true;
      }

      for (const input of article.querySelectorAll<HTMLInputElement>('.DemoPreview input[defaultvalue]')) {
        if (!input.value) input.value = input.getAttribute('defaultvalue') ?? '';
      }

      for (const button of article.querySelectorAll<HTMLButtonElement>('.DemoPreview button')) {
        if (button.textContent?.trim() || button.getAttribute('aria-label')) continue;
        const root = button.closest<HTMLElement>('[data-demo-part="Root"]');
        const label = root?.querySelector<HTMLElement>('[data-demo-part="Label"]')?.textContent?.trim();
        if (label) button.setAttribute('aria-label', label);
        else if (button.dataset.demoPart === 'Trigger') button.setAttribute('aria-label', 'Open menu');
      }
    }

    const demoObserver = new MutationObserver(initializeDemoMarkup);
    demoObserver.observe(article, { childList: true, subtree: true });
    initializeDemoMarkup();

    function click(event: MouseEvent) {
      const target = event.target as Element | null;
      const installationTab = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-installation-block] [role="tab"]');
      if (installationTab && article.contains(installationTab)) {
        activateInstallationTab(installationTab);
        return;
      }

      const demoFile = target?.closest<HTMLElement>('.DemoTab[data-demo-file]');
      if (demoFile && article.contains(demoFile)) {
        if (!(event.ctrlKey || event.metaKey)) event.preventDefault();
        const root = demoFile.closest<HTMLElement>('.DemoRoot');
        if (root) setDemoFile(root, demoFile);
        return;
      }

      const variantTrigger = target?.closest<HTMLElement>('[data-demo-action="variant"]');
      if (variantTrigger && article.contains(variantTrigger)) {
        const root = variantTrigger.closest<HTMLElement>('.DemoRoot');
        const popup = variantTrigger.parentElement?.querySelector<HTMLElement>('.DemoVariantPopup');
        if (!root || !popup) return;
        const open = popup.hidden;
        closeDemoPopups(root, open ? popup : undefined);
        popup.hidden = !open;
        variantTrigger.setAttribute('aria-expanded', String(open));
        if (open) popup.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
        return;
      }

      const variantOption = target?.closest<HTMLElement>('[data-demo-variant-option]');
      if (variantOption && article.contains(variantOption)) {
        const root = variantOption.closest<HTMLElement>('.DemoRoot');
        if (root) setDemoVariant(root, variantOption);
        return;
      }

      const moreTrigger = target?.closest<HTMLElement>('[data-demo-action="more"]');
      if (moreTrigger && article.contains(moreTrigger)) {
        const root = moreTrigger.closest<HTMLElement>('.DemoRoot');
        const popup = moreTrigger.parentElement?.querySelector<HTMLElement>('.DemoMorePopup');
        if (!root || !popup) return;
        const open = popup.hidden;
        closeDemoPopups(root, open ? popup : undefined);
        popup.hidden = !open;
        moreTrigger.setAttribute('aria-expanded', String(open));
        if (open) popup.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
        return;
      }

      const stackBlitz = target?.closest<HTMLElement>('[data-demo-action="stackblitz"]');
      if (stackBlitz && article.contains(stackBlitz)) {
        window.open('https://stackblitz.com/fork/svelte?file=src%2FApp.svelte', '_blank', 'noopener');
        return;
      }

      const copySource = target?.closest<HTMLElement>('[data-demo-action="copy-source"]');
      if (copySource && article.contains(copySource)) {
        const root = copySource.closest<HTMLElement>('.DemoRoot');
        void navigator.clipboard?.writeText(root?.dataset.sourceUrl ?? '');
        closeDemoPopups(root!);
        return;
      }

      const copyCode = target?.closest<HTMLButtonElement>('[aria-label="Copy code"]');
      if (copyCode && article.contains(copyCode)) {
        const container = copyCode.closest('.CodeFrame, .CodeBlockRoot, .DemoCodeBlockRoot');
        const code = [...(container?.querySelectorAll<HTMLElement>('pre:not([hidden]) code') ?? [])][0]?.textContent
          ?? container?.querySelector('code')?.textContent
          ?? '';
        void navigator.clipboard?.writeText(code);
        return;
      }

      const showCode = (event.target as Element | null)?.closest<HTMLButtonElement>('.DemoShowCode');
      if (showCode && article.contains(showCode)) {
        const root = showCode.closest('.DemoRoot');
        const expanded = root?.classList.toggle('DemoCodeExpanded') ?? false;
        const label = showCode.querySelector<HTMLElement>('.DemoCollapseButtonVisual');
        if (label) label.textContent = expanded ? 'Hide code' : 'Show code';
        return;
      }

      const component = target?.closest<HTMLElement>('[data-demo-component]');
      if (component && article.contains(component)) {
        const name = component.dataset.demoComponent;
        const selectedItem = component.closest<HTMLElement>('[data-demo-component="Select.Item"]');
        if (selectedItem) {
          const root = selectedItem.closest<HTMLElement>('[data-demo-component="Select.Root"]');
          const label = selectedItem.querySelector<HTMLElement>('[data-demo-part="ItemText"]')?.textContent?.trim()
            ?? selectedItem.textContent?.trim()
            ?? '';
          const value = root?.querySelector<HTMLElement>('[data-demo-part="Value"]');
          if (value) {
            value.textContent = label;
            value.removeAttribute('data-placeholder');
          }
          for (const item of root?.querySelectorAll<HTMLElement>('[data-demo-component="Select.Item"]') ?? []) {
            const selected = item === selectedItem;
            item.toggleAttribute('data-selected', selected);
            item.setAttribute('aria-selected', String(selected));
            const indicator = item.querySelector<HTMLElement>('[data-demo-part="ItemIndicator"]');
            if (indicator) indicator.hidden = !selected;
          }
          const trigger = root?.querySelector<HTMLElement>('[data-demo-part="Trigger"]');
          const popup = root?.querySelector<HTMLElement>('[data-demo-part="Popup"]');
          if (trigger && popup) setDemoOverlayOpen(trigger, popup, false);
          trigger?.focus();
          return;
        }
        if (name?.endsWith('.Close')) {
          const root = component.closest<HTMLElement>('[data-demo-part="Root"]');
          const trigger = root?.querySelector<HTMLElement>('[data-demo-part="Trigger"]');
          const popup = root?.querySelector<HTMLElement>('[data-demo-part="Popup"]');
          if (trigger && popup) setDemoOverlayOpen(trigger, popup, false);
          trigger?.focus();
          return;
        }
        if (name === 'Checkbox.Root' || name === 'Switch.Root') {
          setChecked(component, component.getAttribute('aria-checked') !== 'true');
          return;
        }
        if (name === 'Radio.Root') {
          const group = component.closest<HTMLElement>('[data-demo-component="RadioGroup.Root"]');
          for (const radio of group?.querySelectorAll<HTMLElement>('[data-demo-component="Radio.Root"]') ?? []) {
            setChecked(radio, radio === component);
          }
          return;
        }
        if (name === 'Toggle') {
          const pressed = component.getAttribute('aria-pressed') !== 'true';
          component.setAttribute('aria-pressed', String(pressed));
          component.toggleAttribute('data-pressed', pressed);
          return;
        }
        if (name === 'Tabs.Tab') {
          selectDemoTab(component);
          return;
        }
        if (name === 'NumberField.Increment' || name === 'NumberField.Decrement') {
          const root = component.closest<HTMLElement>('[data-demo-component="NumberField.Root"]');
          const input = root?.querySelector<HTMLInputElement>('[data-demo-component="NumberField.Input"]');
          if (!input) return;
          const step = Number(root?.getAttribute('step') ?? input.step ?? 1) || 1;
          const next = (Number(input.value || input.getAttribute('defaultvalue') || 0) || 0)
            + (name.endsWith('Increment') ? step : -step);
          input.value = String(next);
          return;
        }
      }

      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-demo-part="Trigger"]');
      if (!trigger || !article.contains(trigger)) return;

      const group = trigger.closest<HTMLElement>('[data-demo-part="Item"]') ?? trigger.parentElement;
      const localPanel = group?.querySelector<HTMLElement>('[data-demo-part="Panel"], [data-demo-part="Content"]');
      const preview = trigger.closest('.DemoPreview');
      const componentRoot = trigger.closest<HTMLElement>('[data-demo-part="Root"]');
      const popup = localPanel
        ?? componentRoot?.querySelector<HTMLElement>('[data-demo-part="Popup"]')
        ?? preview?.querySelector<HTMLElement>('[data-demo-part="Popup"]');
      if (!popup) return;

      const opening = trigger.getAttribute('aria-expanded') !== 'true';
      const demoRoot = trigger.closest<HTMLElement>('[data-demo-part="Root"]');
      if (opening && demoRoot && !demoRoot.hasAttribute('multiple')) {
        for (const siblingTrigger of demoRoot.querySelectorAll<HTMLElement>('[data-demo-part="Trigger"][aria-expanded="true"]')) {
          if (siblingTrigger === trigger) continue;
          const siblingGroup = siblingTrigger.closest<HTMLElement>('[data-demo-part="Item"]') ?? siblingTrigger.parentElement;
          const siblingPanel = siblingGroup?.querySelector<HTMLElement>('[data-demo-part="Panel"], [data-demo-part="Content"]');
          if (siblingPanel) setDemoPanelOpen(siblingTrigger, siblingPanel, siblingGroup, false);
        }
      }
      if (localPanel) setDemoPanelOpen(trigger, popup, group, opening);
      else setDemoOverlayOpen(trigger, popup, opening);
    }

    function keydown(event: KeyboardEvent) {
      const tab = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-installation-block] [role="tab"]');
      if (tab && article.contains(tab) && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        const tabs = [...(tab.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])];
        const index = tabs.indexOf(tab);
        const next = event.key === 'Home' ? tabs[0]
          : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        if (!next) return;
        event.preventDefault();
        activateInstallationTab(next);
        next.focus();
        return;
      }

      const demoTab = (event.target as Element | null)?.closest<HTMLElement>('.DemoTab[data-demo-file]');
      if (demoTab && article.contains(demoTab) && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        const tabs = [...(demoTab.closest('[role="tablist"]')?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])];
        const index = tabs.indexOf(demoTab);
        const next = event.key === 'Home' ? tabs[0]
          : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        if (!next) return;
        event.preventDefault();
        const root = demoTab.closest<HTMLElement>('.DemoRoot');
        if (root) setDemoFile(root, next);
        next.focus();
        return;
      }

      const componentTab = (event.target as Element | null)?.closest<HTMLElement>('[data-demo-component="Tabs.Tab"]');
      if (componentTab && article.contains(componentTab) && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        const root = componentTab.closest<HTMLElement>('[data-demo-component="Tabs.Root"]');
        const tabs = [...(root?.querySelectorAll<HTMLElement>('[data-demo-component="Tabs.Tab"]') ?? [])];
        const index = tabs.indexOf(componentTab);
        const next = event.key === 'Home' ? tabs[0]
          : event.key === 'End' ? tabs.at(-1)
          : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        if (!next) return;
        event.preventDefault();
        selectDemoTab(next);
        next.focus();
        return;
      }

      if (event.key === 'Escape') {
        const root = (event.target as Element | null)?.closest<HTMLElement>('.DemoRoot');
        if (root) closeDemoPopups(root);
      }
    }

    function contextmenu(event: MouseEvent) {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-demo-component="ContextMenu.Trigger"]');
      if (!trigger || !article.contains(trigger)) return;
      const preview = trigger.closest<HTMLElement>('.DemoPreview');
      const popup = preview?.querySelector<HTMLElement>('[data-demo-part="Popup"], [data-demo-part="Positioner"]');
      if (!popup) return;
      event.preventDefault();
      popup.hidden = false;
      popup.style.position = 'fixed';
      popup.style.left = `${event.clientX}px`;
      popup.style.top = `${event.clientY}px`;
      trigger.setAttribute('aria-expanded', 'true');
    }

    article.addEventListener('click', click);
    article.addEventListener('keydown', keydown);
    article.addEventListener('contextmenu', contextmenu);
    return () => {
      demoObserver.disconnect();
      article.removeEventListener('click', click);
      article.removeEventListener('keydown', keydown);
      article.removeEventListener('contextmenu', contextmenu);
    };
  }

</script>

<svelte:head>
  <title>{data.title} · Base UI</title>
  <link rel="canonical" href={`https://baseui-svelte.vercel.app/svelte${data.path ? `/${data.path}` : ''}`} />
</svelte:head>

<a class="SkipNav" href="#main-content">Skip to contents</a>

<div class="RootLayout" {@attach keyboardShortcuts}>
  <div class="RootLayoutContainer">
    <div class="RootLayoutContent">
      <div class="ContentLayoutRoot">
        <header class="Header">
          <div class="HeaderInner">
            <a class="HeaderLogoLink" href="/svelte/components" aria-label="Go to the homepage">
              <svg width="17" height="24" viewBox="0 0 17 24" fill="currentColor" aria-label="Base UI">
                <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
                <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
              </svg>
            </a>
            <div class="HeaderSearch">
              <button bind:this={desktopTrigger} class="SearchTrigger SearchTriggerDesktop" type="button" aria-haspopup="dialog" aria-expanded={navigationOpen && navigationMode === 'desktop'} onclick={() => openNavigation('desktop', desktopTrigger)}>
                Search <span class="SearchTriggerShortcut">({shortcutPrefix}k)</span>
              </button>
              <button bind:this={mobileTrigger} class="SearchTrigger SearchTriggerMobile" type="button" aria-haspopup="dialog" aria-expanded={navigationOpen && navigationMode === 'mobile'} onclick={() => openNavigation('mobile', mobileTrigger)}>
                <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m11 11 3.5 3.5" /><circle cx="7" cy="7" r="5.5" /></svg>
                Navigation
              </button>
            </div>
          </div>
        </header>

        <nav class="SideNavRoot" aria-label="Main navigation">
          <div class="SideNavViewport">
            <div class="SideNavSection">
              <div class="SideNavHeading">Overview</div>
              <ul class="SideNavList">
                {#each overview as item}
                  <li class="SideNavItem"><a class="SideNavLink" href={docsHref('overview', item)} aria-current={data.path === `overview/${slug(item)}` ? 'page' : undefined}>{item}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Handbook</div>
              <ul class="SideNavList">
                {#each handbook as item}
                  <li class="SideNavItem"><a class="SideNavLink" href={docsHref('handbook', item)} aria-current={data.path === `handbook/${slug(item)}` ? 'page' : undefined}>{item}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Components</div>
              <ul class="SideNavList">
                {#each data.components as component}
                  <li class="SideNavItem"><a class="SideNavLink" href={docsHref('components', component)} aria-current={data.path === `components/${slug(component)}` ? 'page' : undefined}>{component}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Utils</div>
              <ul class="SideNavList">
                {#each utils as item}
                  <li class="SideNavItem"><a class="SideNavLink" href={docsHref('utils', item)} aria-current={data.path === `utils/${slug(item)}` ? 'page' : undefined}>{item}</a></li>
                {/each}
              </ul>
            </div>
            <hr class="SideNavSeparator" />
            <div class="SideNavSection">
              <ul class="SideNavList">
                <li class="SideNavItem">
                  <a class="SideNavLink SideNavIconLink" href="https://github.com/itisyb/baseui-svelte">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.57983 0 0 3.67031 0 8.20221c0 3.62969 2.29009 6.69509 5.46991 7.78139.4.072.54957-.174.54957-.3894 0-.1947-.00974-.8402-.00974-1.5278-2.00974.3795-2.52939-.5021-2.68939-.9628-.09044-.2361-.48-.9643-.82087-1.1591-.27965-.1541-.67965-.5334-.00974-.5434.63026-.01 1.08035.5948 1.23061.8409.72 1.241 1.86991.8915 2.32974.6761.06956-.5328.27965-.8915.50991-1.0969-1.78017-.2047-3.63965-.9122-3.63965-4.04979 0-.89154.30956-1.62974.81948-2.20389-.08-.20542-.35966-1.04632.08-2.17395 0 0 .66991-.21539 2.20034.84091.64-.18473 1.31966-.27674 2-.27674.67966 0 1.36.09272 2.00003.27674 1.5304-1.06629 2.1996-.84091 2.1996-.84091.4404 1.12763.16 1.96853.08 2.17395.5099.57415.8202 1.30165.8202 2.20389 0 3.14759-1.8699 3.84439-3.65004 4.04979.29004.2567.53974.7489.53974 1.5177 0 1.097-.00975 1.9785-.00975 2.2553 0 .2154.15035.4721.54965.3902C13.7107 14.8973 16 11.8212 16 8.20221 16 3.67031 12.4202 0 8 0" /></svg>
                    GitHub
                  </a>
                </li>
                <li class="SideNavItem">
                  <a class="SideNavLink SideNavIconLink" href="https://www.npmjs.com/package/@itisyb/baseui-svelte">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect width="16" height="16" fill="black" /><rect x="3" y="3" width="10" height="10" fill="white" /><path d="M8 5H11V13H8V5Z" fill="black" /></svg>
                    <span>npm<span class="SideNavVersion">0.1.0</span></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main class="ContentLayoutMain" id="main-content">
          <div class="QuickNavContainer">
            <nav class="QuickNavRoot" aria-label="On this page">
              <div class="QuickNavInner">
                <div class="QuickNavViewport">
                  <header class="VisuallyHidden">{data.title}</header>
                  <ul class="QuickNavList">
                    <li><a class="QuickNavLink" href={'#'}>(Top)</a></li>
                    {#each data.headings as heading}
                      <li class:data-depth-3={heading.depth === 3}><a class="QuickNavLink" href={`#${heading.id}`}>{heading.text}</a></li>
                    {/each}
                  </ul>
                </div>
              </div>
            </nav>
            <div class="QuickNavContent">
              <article class="MdContent" {@attach enhanceDemos}>{@html data.html}</article>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</div>

<DocsNavigation components={data.components} bind:open={navigationOpen} mode={navigationMode} finalFocus={navigationTrigger} />
