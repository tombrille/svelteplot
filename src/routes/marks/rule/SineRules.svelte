<script lang="ts">
    import { Figure, RuleX, RuleY } from '$lib';
    import GridX from '$lib/marks/GridX.svelte';
    import GridY from '$lib/marks/GridY.svelte';
    import { range } from 'd3-array';
</script>

<Figure let:figure>
    <GridX
        data={range(0, 3.01, 0.5).map((d) => d * Math.PI)}
        tickFormat={(d) => `${Number(d) / Math.PI}π`}
    />
    <GridY data={[-1, -0.5, 0, 0.5, 1]} />

    <RuleX
        data={range(0, Math.PI * 3, 0.1)}
        y1={0}
        y2={(d) => Math.sin(Number(d))}
        stroke="teal"
        strokeOpacity="0.8"
        strokeWidth={figure.plotWidth / 100 / 2}
    />
    <RuleY data={[0]} />
</Figure>
