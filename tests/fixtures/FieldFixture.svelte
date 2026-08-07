<script lang="ts">
  import * as Field from '../../src/lib/field/index.js';
</script>
<Field.Root name="email" required>
  <Field.Label>Email</Field.Label>
  <Field.Control type="email" />
  <Field.Description>Work email only.</Field.Description>
  <Field.Error>Enter a valid email.</Field.Error>
</Field.Root>
