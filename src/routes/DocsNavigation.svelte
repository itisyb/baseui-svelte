<script lang="ts">
  import * as Dialog from '../lib/dialog/index.js';

  interface Props {
    components: readonly string[];
    open?: boolean;
    mode: 'desktop' | 'mobile';
    finalFocus?: HTMLElement | null;
  }

  let { components, open = $bindable(false), mode, finalFocus }: Props = $props();

  const overview = ['Quick start', 'Accessibility', 'Releases', 'Community', 'About'];
  const handbook = ['Styling', 'Animation', 'Composition', 'Customization', 'Forms', 'TypeScript', 'llms.txt'];
  const utils = ['CSP Provider', 'Direction Provider', 'mergeProps', 'useRender'];

  let query = $state('');
  let highlighted = $state(0);
  let desktopInput = $state<HTMLInputElement>();
  let mobilePopup = $state<HTMLDivElement | null>(null);
  let wasOpen = false;
  let mobileStarting = $state(false);

  function slug(value: string) {
    if (value === 'llms.txt') return 'llms.txt';
    if (value === 'mergeProps') return 'merge-props';
    if (value === 'useRender') return 'use-render';
    return value.toLowerCase().replaceAll(' ', '-');
  }

  function href(section: string, item: string) {
    if (item === 'llms.txt') return 'https://base-ui.com/llms.txt';
    if (section === 'Overview') return `https://base-ui.com/react/overview/${slug(item)}`;
    if (section === 'Handbook') return `https://base-ui.com/react/handbook/${slug(item)}`;
    if (section === 'Components') return `https://base-ui.com/react/components/${slug(item)}`;
    return `https://base-ui.com/react/utils/${slug(item)}`;
  }

  const groups = $derived([
    { label: 'Overview', items: overview },
    { label: 'Handbook', items: handbook },
    { label: 'Components', items: [...components] },
    { label: 'Utils', items: utils },
  ]);
  const filteredGroups = $derived(
    groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())),
      }))
      .filter((group) => group.items.length > 0),
  );
  const results = $derived(filteredGroups.flatMap((group) => group.items.map((item) => ({ ...group, item }))));

  $effect.pre(() => {
    if (open && !wasOpen) {
      query = '';
      highlighted = 0;
      if (mode === 'mobile') {
        mobileStarting = true;
        requestAnimationFrame(() => requestAnimationFrame(() => (mobileStarting = false)));
      }
    }
    wasOpen = open;
  });

  $effect(() => {
    query;
    highlighted = 0;
  });

  function optionIndex(label: string, item: string) {
    return results.findIndex((result) => result.label === label && result.item === item);
  }

  function select(index: number) {
    if (!results.length) return;
    highlighted = (index + results.length) % results.length;
    requestAnimationFrame(() => {
      document.getElementById(`docs-search-option-${highlighted}`)?.scrollIntoView({ block: 'nearest' });
    });
  }

  function handleInputKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      select(highlighted + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      select(highlighted - 1);
    } else if (event.key === 'Enter' && results[highlighted]) {
      event.preventDefault();
      window.location.href = href(results[highlighted].label, results[highlighted].item);
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    {#if mode === 'desktop'}
      <Dialog.Backdrop class="SearchBackdrop" />
      <div class="SearchViewport">
        <Dialog.Popup
          class="SearchPopup"
          initialFocus={() => desktopInput ?? null}
          {finalFocus}
        >
          <Dialog.Title class="VisuallyHidden">Search documentation</Dialog.Title>
          <div class="SearchHead">
            <div class="SearchInputRoot">
              <svg class="SearchInputIcon" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round"><path d="m11 11 3.5 3.5" /><circle cx="7" cy="7" r="5.5" /></svg>
              <input
                bind:this={desktopInput}
                bind:value={query}
                class="SearchInput"
                id="search-input"
                role="combobox"
                aria-label="Search"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls="docs-search-list"
                aria-activedescendant={results[highlighted] ? `docs-search-option-${highlighted}` : undefined}
                placeholder="Search"
                autocomplete="off"
                spellcheck="false"
                onkeydown={handleInputKeydown}
              />
            </div>
          </div>
          <div class="SearchBody">
            <div class="SearchScrollAreaRoot">
              <div class="SearchScrollAreaViewport">
                {#if results.length}
                  <div class="SearchList" id="docs-search-list" role="listbox" aria-label="Search results">
                    {#each filteredGroups as group}
                      <div class="SearchGroup" role="group" aria-labelledby={`search-group-${slug(group.label)}`}>
                        <div class="SearchGroupLabel" id={`search-group-${slug(group.label)}`}>{group.label}</div>
                        {#each group.items as item}
                          {@const index = optionIndex(group.label, item)}
                          <a
                            class="SearchOptionItem"
                            id={`docs-search-option-${index}`}
                            href={href(group.label, item)}
                            role="option"
                            aria-selected={highlighted === index}
                            data-highlighted={highlighted === index ? '' : undefined}
                            tabindex="-1"
                            onpointerenter={() => (highlighted = index)}
                          ><span class="SearchBreadcrumbPart last">{item}</span></a>
                        {/each}
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="SearchEmptyState">No results found.</div>
                {/if}
              </div>
              <div class="SearchScrollbar" aria-hidden="true"><div class="SearchScrollbarThumb"></div></div>
            </div>
          </div>
          <div class="SearchFooter">
            <div class="SearchFooterHint">
              <kbd class="SearchFooterEnter" aria-label="Enter"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 10-5 5 5 5" /><path d="M20 4v7a4 4 0 0 1-4 4H4" /></svg></kbd>
              <span>Go to page</span>
            </div>
            <Dialog.Close class="SearchClose">Close</Dialog.Close>
          </div>
        </Dialog.Popup>
      </div>
    {:else}
      <Dialog.Backdrop class="MobileNavBackdrop" data-starting-style={mobileStarting ? '' : undefined} />
      <div class="MobileNavViewport">
        <Dialog.Popup
          class="MobileNavPopup"
          bind:ref={mobilePopup}
          initialFocus={() => mobilePopup ?? null}
          {finalFocus}
          data-starting-style={mobileStarting ? '' : undefined}
        >
          <Dialog.Title class="VisuallyHidden">Docs navigation</Dialog.Title>
          <div class="MobileNavSearchHeader">
            <div class="MobileNavHandle"></div>
            <div class="MobileNavSearchInputRoot">
              <svg class="MobileNavSearchIcon" aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round"><path d="m11 11 3.5 3.5" /><circle cx="7" cy="7" r="5.5" /></svg>
              <input
                bind:value={query}
                class="MobileNavSearchInput"
                id="mobile-docs-search-input"
                role="combobox"
                aria-label="Search"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls="mobile-docs-results"
                placeholder="Search"
                autocomplete="off"
                spellcheck="false"
                onkeydown={handleInputKeydown}
              />
            </div>
          </div>
          <div class="MobileNavContent">
            <div class="MobileNavScrollAreaRoot">
              <div class="MobileNavScrollAreaViewport">
                <div class="MobileNavScrollAreaContent">
                  {#if query.trim()}
                    <div class="MobileNavSearchResults" id="mobile-docs-results">
                      {#if results.length}
                        <ul class="MobileNavSearchList" role="listbox" aria-label="Search results">
                          {#each results as result, index}
                            <li>
                              <a
                                class="MobileNavSearchOption"
                                href={href(result.label, result.item)}
                                role="option"
                                aria-selected={highlighted === index}
                                data-highlighted={highlighted === index ? '' : undefined}
                                onpointerenter={() => (highlighted = index)}
                              >
                                <span class="MobileNavSearchBreadcrumbText">{result.label}<span class="MobileNavSearchBreadcrumbSeparator">›</span>{result.item}</span>
                              </a>
                            </li>
                          {/each}
                        </ul>
                      {:else}
                        <div class="MobileNavEmptyState">No results found.</div>
                      {/if}
                    </div>
                  {:else}
                    <nav class="MobileNavPanel" id="mobile-docs-results" aria-label="Docs navigation">
                      {#each groups as group}
                        <div class="MobileNavSection">
                          <div class="MobileNavHeading">{group.label}</div>
                          <ul class="MobileNavList">
                            {#each group.items as item}
                              <li><a class="MobileNavLink" href={href(group.label, item)}><span class="MobileNavLinkText">{item}</span></a></li>
                            {/each}
                          </ul>
                        </div>
                      {/each}
                      <div class="MobileNavSection">
                        <div class="MobileNavHeading">Resources</div>
                        <ul class="MobileNavList">
                          <li><a class="MobileNavLink" href="https://www.npmjs.com/package/@base-ui/react"><span class="MobileNavResourceRow"><span class="MobileNavLinkText">npm package</span><span class="MobileNavVersion">1.7.0</span></span></a></li>
                          <li><a class="MobileNavLink" href="https://github.com/itisyb/baseui-svelte"><span class="MobileNavLinkText">GitHub</span></a></li>
                        </ul>
                      </div>
                    </nav>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </div>
    {/if}
  </Dialog.Portal>
</Dialog.Root>
