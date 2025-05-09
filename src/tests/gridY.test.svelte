<script lang="ts">
  import { GridY, Plot } from 'svelteplot';
  let { plotArgs, gridArgs } = $props();
</script>

<Plot width={100} height={100} axes={false} {...plotArgs}>
  <GridY {...gridArgs} />
</Plot>
