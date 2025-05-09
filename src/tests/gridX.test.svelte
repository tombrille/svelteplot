<script lang="ts">
  import { GridX, Plot } from 'svelteplot';
  let { plotArgs, gridArgs } = $props();
</script>

<Plot width={100} height={100} axes={false} {...plotArgs}>
  <GridX {...gridArgs} />
</Plot>
