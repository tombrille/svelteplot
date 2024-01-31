<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';

    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<Plot testid="area-y1">
    <AreaY data={aapl} x="Date" y="Close" />
</Plot>
