# Port status

The upstream reference for this snapshot is `@base-ui/react` 1.7.0. All 40 public component families and all named parts from the upstream part barrels are represented.

## Implemented

| Family | Parts / behavior |
| --- | --- |
| Accordion | Root, Item, Header, Trigger, Panel; single/multiple values and roving focus |
| Alert Dialog | Dialog behavior with `alertdialog` semantics |
| Avatar | Root, Image, delayed Fallback and image status |
| Button | Native button and custom child snippet |
| Checkbox / Checkbox Group | Boolean/indeterminate state, indicators, form values, grouped values |
| Collapsible | Root, Trigger, Panel |
| Dialog | Portal, Backdrop, Popup, Title, Description, Close; modal focus management |
| Direction Provider | Typed direction context |
| Field / Fieldset / Form | Native labelling, descriptions, validity, errors, and form semantics |
| Input | Bindable native input |
| Meter / Progress | Accessible value semantics and state attributes |
| Number Field | Input, Group, steppers, scrub area, bounds and step snapping |
| OTP Field | Root and individual character inputs; keyboard, paste, masking and completion |
| Popover | Trigger, Portal, Positioner, Popup, Arrow, Backdrop, title/description/close |
| Radio / Radio Group | Form participation and roving focus |
| Scroll Area | Viewport, Content, Scrollbar, Thumb and Corner |
| Select | Label, Trigger, Value, List, Item, groups, indicators, portal and positioning |
| Separator | Horizontal and vertical semantics |
| Slider | Single/range values, pointer and keyboard input, track/indicator/thumb/label/value |
| Switch | Root, Thumb and form value |
| Tabs | List, Tab, Panel, Indicator and automatic/manual activation |
| Toggle / Toggle Group | Single and grouped pressed state with roving focus |
| Toolbar | Button, Link, Input, Group, Separator and roving focus |
| Tooltip | Provider, Root, Trigger, Portal, Positioner, Popup and Arrow |
| Autocomplete | Full named-part surface backed by the shared collection and filtering engine |
| Combobox | Arbitrary items, filtering, active descendant navigation, multi-select chips, collection rendering and announcements |
| Context Menu | Pointer-positioned opening with the complete Menu part surface |
| CSP Provider | Reactive nonce context for CSP-aware integrations |
| Drawer | Dialog semantics, swipe dismissal/opening, snap-point state, indents and imperative handles |
| Menu | Items, links, checkbox/radio items, groups, submenus, typeahead and imperative handles |
| Menubar | Horizontal/vertical menubar semantics and roving focus |
| Navigation Menu | Root/list/item/content model, triggers, links and floating parts |
| Preview Card | Delayed hover/focus opening, floating parts and handles |
| Toast | Provider, reactive manager, limits, timers, pause/resume, promise updates and all visual parts |

## Parity definition

- Every upstream component family and named part is exported under the equivalent package subpath.
- Stateful roots expose Svelte bindings plus reasoned change callbacks.
- Keyboard, pointer, focus, form, portal, and ARIA behavior is implemented for each interaction model.
- React-only hooks, refs, and render props are expressed through Svelte context, snippets, callback props, bindable refs, or imperative handle classes.
- A permanent export-parity test covers the complete part map, while interaction tests cover representative flows from every behavior class.

Type signatures are intentionally Svelte-native rather than textual copies of React prop types. That is a framework translation, not a missing component surface.
