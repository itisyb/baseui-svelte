# Architecture

## Public API

Each component family is a module of named parts. The root barrel exposes namespaces (`Accordion.Root`), while package subpaths expose the same parts (`@itisyb/baseui-svelte/accordion`). This keeps Base UI's recognizable composition without transporting React hooks or render-prop mechanics into Svelte.

State props are bindable. Change callbacks are separate because they carry useful metadata:

```ts
type OnValueChange<T, Reason extends string> = (
  value: T,
  details: { reason: Reason; event?: Event },
) => void;
```

## Reactivity

Shared state lives in classes declared in `.svelte.ts` modules. Fields use `$state`; derived values use getters or `$derived` in consuming components. Context uses Svelte's typed `createContext` API. This keeps updates synchronous and local without store subscriptions.

Effects are reserved for DOM synchronization: focus, observers, element registration, scroll locking, and Floating UI updates. Prop-to-context synchronization uses `$effect.pre` so descendants see current values during DOM updates.

## Markup and composition

Parts default to semantic native elements and forward the remaining element props. Content is a Svelte 5 `Snippet`. Button currently exposes a custom `child` snippet for element substitution; expanding that Svelte-native rendering contract consistently across all parts is tracked in the port status.

State is exposed with presence-based `data-*` attributes. Components do not own visual CSS, animation durations, transitions, colors, or layout.

## Accessibility

The implementation follows the WAI-ARIA Authoring Practices interaction models:

- roving focus for accordion, tabs, radio groups, toolbars, and toggle groups;
- focus trapping, restoration, labelling, and background isolation for modal dialogs;
- listbox semantics and keyboard selection for Select;
- native form participation for checkbox, switch, radio, number, OTP, slider, and select values;
- stable server/client IDs through `$props.id()`;
- descriptions and validation messages connected with ARIA ID references.

User event callbacks are composed before internal handlers. Calling `preventDefault()` lets an application veto the built-in transition.

## Floating elements

Popover, Tooltip, and Select use `@floating-ui/dom`. Positioners subscribe through `autoUpdate` only while open. Placement results are reflected as `data-side` and `data-align`; arrows consume Floating UI middleware coordinates. Portal movement is implemented as a Svelte attachment so it has a clear mount/cleanup lifecycle.

## Testing

Tests exercise rendered components through accessible roles and user input. The suite intentionally avoids assertions against component internals. Svelte Testing Library's browser resolution plugin ensures tests use Svelte's client runtime under jsdom.
