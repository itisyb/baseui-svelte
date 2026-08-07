<script lang="ts">
  import { onMount } from 'svelte';

  interface Data {
    components: readonly string[];
    html: string;
  }

  let { data }: { data: Data } = $props();

  const overview = ['Quick start', 'Accessibility', 'Releases', 'Community', 'About'];
  const handbook = ['Styling', 'Animation', 'Composition', 'Customization', 'Forms', 'TypeScript', 'llms.txt'];
  const utils = ['CSP Provider', 'Direction Provider', 'mergeProps', 'useRender'];
  let shortcutPrefix = $state('⌘');

  function slug(value: string) {
    if (value === 'About') return 'about';
    if (value === 'llms.txt') return 'llms.txt';
    if (value === 'mergeProps') return 'merge-props';
    if (value === 'useRender') return 'use-render';
    return value.toLowerCase().replaceAll(' ', '-');
  }

  onMount(() => {
    shortcutPrefix = /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? '⌘' : 'Ctrl+';
  });

</script>

<svelte:head>
  <title>Components · Base UI</title>
</svelte:head>

<a class="SkipNav" href="#main-content">Skip to contents</a>

<div class="RootLayout">
  <div class="RootLayoutContainer">
    <div class="RootLayoutContent">
      <div class="ContentLayoutRoot">
        <header class="Header">
          <div class="HeaderInner">
            <a class="HeaderLogoLink" href="/" aria-label="Go to the homepage">
              <svg width="17" height="24" viewBox="0 0 17 24" fill="currentColor" aria-label="Base UI">
                <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
                <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
              </svg>
            </a>
            <div class="HeaderSearch">
              <button class="SearchTrigger SearchTriggerDesktop" type="button">
                Search <span class="SearchTriggerShortcut">({shortcutPrefix}k)</span>
              </button>
              <button class="SearchTrigger SearchTriggerMobile" type="button">
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
                  <li class="SideNavItem"><a class="SideNavLink" href={`https://base-ui.com/react/overview/${slug(item)}`}>{item}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Handbook</div>
              <ul class="SideNavList">
                {#each handbook as item}
                  <li class="SideNavItem"><a class="SideNavLink" href={item === 'llms.txt' ? 'https://base-ui.com/llms.txt' : `https://base-ui.com/react/handbook/${slug(item)}`}>{item}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Components</div>
              <ul class="SideNavList">
                {#each data.components as component}
                  <li class="SideNavItem"><a class="SideNavLink" href={`https://base-ui.com/react/components/${slug(component)}`}>{component}</a></li>
                {/each}
              </ul>
            </div>
            <div class="SideNavSection">
              <div class="SideNavHeading">Utils</div>
              <ul class="SideNavList">
                {#each utils as item}
                  <li class="SideNavItem"><a class="SideNavLink" href={`https://base-ui.com/react/utils/${slug(item)}`}>{item}</a></li>
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
                  <a class="SideNavLink SideNavIconLink" href="https://www.npmjs.com/package/@base-ui/react">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect width="16" height="16" fill="black" /><rect x="3" y="3" width="10" height="10" fill="white" /><path d="M8 5H11V13H8V5Z" fill="black" /></svg>
                    <span>npm<span class="SideNavVersion">1.7.0</span></span>
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
                  <header class="VisuallyHidden">Components</header>
                  <ul class="QuickNavList">
                    <li><a class="QuickNavLink" href={'#'}>(Top)</a></li>
                    {#each data.components as component}
                      <li><a class="QuickNavLink" href={`#${slug(component)}`}>{component}</a></li>
                    {/each}
                  </ul>
                </div>
              </div>
            </nav>
            <div class="QuickNavContent">
              <article class="MdContent">{@html data.html}</article>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</div>
