import { describe, expect, it } from 'vitest';
import * as BaseUI from '../src/lib/index.js';

const expected: Record<string, string[]> = {
  accordion: ['Root', 'Item', 'Header', 'Trigger', 'Panel'],
  'alert-dialog': ['Root', 'Trigger', 'Portal', 'Viewport', 'Backdrop', 'Popup', 'Title', 'Description', 'Close', 'Handle', 'createHandle'],
  autocomplete: ['Root', 'Value', 'Trigger', 'Input', 'InputGroup', 'Icon', 'Clear', 'List', 'Status', 'Portal', 'Backdrop', 'Positioner', 'Popup', 'Arrow', 'Group', 'GroupLabel', 'Item', 'Row', 'Collection', 'Empty', 'Separator', 'useFilter', 'useFilteredItems'],
  avatar: ['Root', 'Image', 'Fallback'],
  button: ['Root'],
  checkbox: ['Root', 'Indicator'],
  'checkbox-group': ['Root'],
  collapsible: ['Root', 'Trigger', 'Panel'],
  combobox: ['Root', 'Label', 'Value', 'Input', 'InputGroup', 'Trigger', 'List', 'Status', 'Portal', 'Backdrop', 'Positioner', 'Popup', 'Arrow', 'Icon', 'Group', 'GroupLabel', 'Item', 'ItemIndicator', 'Chips', 'Chip', 'ChipRemove', 'Row', 'Collection', 'Empty', 'Clear', 'Separator', 'useFilter', 'useFilteredItems'],
  'context-menu': ['Root', 'Trigger', 'Portal', 'Positioner', 'Popup', 'Arrow', 'Backdrop', 'Group', 'GroupLabel', 'Item', 'CheckboxItem', 'CheckboxItemIndicator', 'LinkItem', 'RadioGroup', 'RadioItem', 'RadioItemIndicator', 'SubmenuRoot', 'SubmenuTrigger', 'Separator'],
  'csp-provider': ['CSPProvider'],
  dialog: ['Root', 'Trigger', 'Portal', 'Viewport', 'Backdrop', 'Popup', 'Title', 'Description', 'Close', 'Handle', 'createHandle'],
  'direction-provider': ['Provider', 'useDirection'],
  drawer: ['Root', 'Provider', 'Indent', 'IndentBackground', 'Trigger', 'Portal', 'Popup', 'SwipeArea', 'Content', 'Backdrop', 'Viewport', 'Title', 'Description', 'Close', 'VirtualKeyboardProvider', 'Handle', 'createHandle'],
  field: ['Root', 'Label', 'Error', 'Description', 'Control', 'Validity', 'Item'],
  fieldset: ['Root', 'Legend'],
  form: ['Root'],
  input: ['Root'],
  menu: ['Root', 'Trigger', 'Portal', 'Positioner', 'Popup', 'Arrow', 'Backdrop', 'Viewport', 'Group', 'GroupLabel', 'Item', 'LinkItem', 'CheckboxItem', 'CheckboxItemIndicator', 'RadioGroup', 'RadioItem', 'RadioItemIndicator', 'SubmenuRoot', 'SubmenuTrigger', 'Separator', 'Handle', 'createHandle'],
  meter: ['Root', 'Track', 'Indicator', 'Value', 'Label'],
  'navigation-menu': ['Root', 'List', 'Item', 'Content', 'Trigger', 'Portal', 'Positioner', 'Viewport', 'Backdrop', 'Popup', 'Arrow', 'Link', 'Icon'],
  'number-field': ['Root', 'Group', 'Input', 'Increment', 'Decrement', 'ScrubArea', 'ScrubAreaCursor'],
  'otp-field': ['Root', 'Input', 'Separator'],
  popover: ['Root', 'Trigger', 'Portal', 'Positioner', 'Popup', 'Arrow', 'Backdrop', 'Title', 'Description', 'Close', 'Viewport', 'Handle', 'createHandle'],
  'preview-card': ['Root', 'Trigger', 'Portal', 'Positioner', 'Popup', 'Arrow', 'Backdrop', 'Viewport', 'Handle', 'createHandle'],
  progress: ['Root', 'Track', 'Indicator', 'Value', 'Label'],
  radio: ['Root', 'Indicator'],
  'radio-group': ['Root'],
  'scroll-area': ['Root', 'Viewport', 'Content', 'Scrollbar', 'Thumb', 'Corner'],
  select: ['Root', 'Label', 'Trigger', 'Value', 'Icon', 'Portal', 'Backdrop', 'Positioner', 'Popup', 'List', 'Item', 'ItemIndicator', 'ItemText', 'Arrow', 'ScrollDownArrow', 'ScrollUpArrow', 'Group', 'GroupLabel', 'Separator'],
  separator: ['Root'],
  slider: ['Root', 'Control', 'Track', 'Indicator', 'Thumb', 'Label', 'Value'],
  switch: ['Root', 'Thumb'],
  tabs: ['Root', 'List', 'Tab', 'Panel', 'Indicator'],
  toast: ['Provider', 'Viewport', 'Root', 'Content', 'Description', 'Title', 'Close', 'Action', 'Portal', 'Positioner', 'Arrow', 'useToastManager', 'createToastManager'],
  toggle: ['Root'],
  'toggle-group': ['Root', 'Item'],
  toolbar: ['Root', 'Group', 'Button', 'Link', 'Input', 'Separator'],
  tooltip: ['Provider', 'Root', 'Trigger', 'Portal', 'Positioner', 'Popup', 'Arrow', 'Viewport', 'Handle', 'createHandle'],
};

describe('Base UI export parity', () => {
  it('exports all 40 upstream families from the package root', () => {
    const families = ['Accordion', 'AlertDialog', 'Autocomplete', 'Avatar', 'Button', 'Checkbox', 'CheckboxGroup', 'Collapsible', 'Combobox', 'ContextMenu', 'CSPProvider', 'Dialog', 'DirectionProvider', 'Drawer', 'Field', 'Fieldset', 'Form', 'Input', 'Menu', 'Menubar', 'Meter', 'NavigationMenu', 'NumberField', 'OTPField', 'Popover', 'PreviewCard', 'Progress', 'Radio', 'RadioGroup', 'ScrollArea', 'Select', 'Separator', 'Slider', 'Switch', 'Tabs', 'Toast', 'Toggle', 'ToggleGroup', 'Toolbar', 'Tooltip'];
    for (const family of families) expect(BaseUI, family).toHaveProperty(family);
  });
  for (const [family, parts] of Object.entries(expected)) {
    it(`${family} exports every upstream part`, async () => {
      const module = await import(`../src/lib/${family}/index.ts`);
      for (const part of parts) expect(module, `${family}.${part}`).toHaveProperty(part);
    });
  }
});
