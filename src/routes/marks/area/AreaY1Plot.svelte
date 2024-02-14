<script lang="ts">
    import { Plot, AreaY } from '$lib/index.js';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot testid="area-y1">
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>
