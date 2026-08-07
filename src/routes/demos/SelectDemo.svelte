<script lang="ts">
  import * as Select from '$lib/select';

  const frameworks = [
    ['svelte', 'Svelte'],
    ['react', 'React'],
    ['vue', 'Vue'],
    ['solid', 'Solid'],
  ] as const;
  let value = $state<string | null>('svelte');
</script>

<Select.Root bind:value>
  <Select.Label class="field-label">Framework</Select.Label>
  <Select.Trigger class="select-trigger">
    <Select.Value placeholder="Select a framework" />
    <Select.Icon class="select-icon">
      <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6l4 4 4-4" /></svg>
    </Select.Icon>
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner sideOffset={8} align="start">
      <Select.Popup class="select-popup">
        <Select.List class="select-list">
          {#each frameworks as framework}
            <Select.Item class="select-item" value={framework[0]} label={framework[1]}>
              <Select.ItemIndicator class="select-check">
                <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
              </Select.ItemIndicator>
              <Select.ItemText />
            </Select.Item>
          {/each}
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
