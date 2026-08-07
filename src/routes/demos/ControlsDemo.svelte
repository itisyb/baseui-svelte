<script lang="ts">
  import * as Checkbox from '$lib/checkbox';
  import * as NumberField from '$lib/number-field';
  import * as Slider from '$lib/slider';
  import * as Switch from '$lib/switch';

  let updates = $state(true);
  let compact = $state(false);
  let volume = $state(64);
  let seats = $state(3);
</script>

<div class="controls-demo">
  <div class="control-row">
    <div>
      <span class="control-label" id="updates-label">Product updates</span>
      <span class="control-description">News and release notes</span>
    </div>
    <Switch.Root class="switch-root" bind:checked={updates} aria-labelledby="updates-label">
      <Switch.Thumb class="switch-thumb" />
    </Switch.Root>
  </div>

  <div class="control-row">
    <div>
      <span class="control-label" id="compact-label">Compact density</span>
      <span class="control-description">Fit more content on screen</span>
    </div>
    <Checkbox.Root class="checkbox-root" bind:checked={compact} aria-labelledby="compact-label">
      <Checkbox.Indicator>
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m3.5 8 3 3 6-6" /></svg>
      </Checkbox.Indicator>
    </Checkbox.Root>
  </div>

  <div class="slider-field">
    <Slider.Root class="slider-root" bind:value={volume}>
      <div class="control-label-row">
        <Slider.Label class="control-label">Volume</Slider.Label>
        <Slider.Value class="control-value" />
      </div>
      <Slider.Control class="slider-control">
        <Slider.Track class="slider-track">
          <Slider.Indicator class="slider-indicator" />
        </Slider.Track>
        <Slider.Thumb class="slider-thumb" />
      </Slider.Control>
    </Slider.Root>
  </div>

  <NumberField.Root class="number-root" bind:value={seats} min={1} max={12}>
    <span class="control-label" id="seats-label">Seats</span>
    <NumberField.Group class="number-group">
      <NumberField.Decrement class="number-button">
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10" /></svg>
      </NumberField.Decrement>
      <NumberField.Input class="number-input" aria-labelledby="seats-label" />
      <NumberField.Increment class="number-button">
        <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M3 8h10M8 3v10" /></svg>
      </NumberField.Increment>
    </NumberField.Group>
  </NumberField.Root>
</div>
