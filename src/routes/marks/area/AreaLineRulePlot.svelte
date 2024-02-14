<script lang="ts">
    import { Plot, Frame, Area, AreaX, AreaY, Line, RuleY } from '$lib/index.js';
    import { page } from '$app/stores';
    let { aapl } = $derived($page.data.data);
</script>

<Plot grid testid="area-line-rule">
    <Area data={aapl} x1="Date" y1={0} y2="Close" opacity={0.25} />
    <Line data={aapl} x="Date" y="Close" />
    <RuleY data={[0]} />
</Plot>
