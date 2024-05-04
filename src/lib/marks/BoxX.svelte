<script lang="ts">
    import GroupMultiple from './helpers/GroupMultiple.svelte';
    import type { BaseMarkProps, ChannelAccessor, DataRecord, DataRow } from '$lib/types.js';
    import { BarX, TickX, RuleY, Dot, groupY } from '$lib/index.js';
    import { resolveChannel } from '$lib/helpers/resolve.js';

    type BoxXProps = {
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
    };

    let { data, x, y }: BoxXProps = $props();

    let { data: grouped } = $derived(groupY(
        { data, x, y, x1: x, x2: x },
        { x: 'median', x1: 'p25', x2: 'p75', fill: rows => rows })
    );

    let boxData = $derived(grouped.map(row => {
        const iqr = row.__x2 - row.__x1;
        const whisker = iqr * 1.5;
        const lower = row.__x1 - whisker;
        const upper = row.__x2 + whisker;
        const data = row.__fill.map(d => ({ ...d, __x: resolveChannel('x', d, { x, y }) }));
        const outliers = data.filter(d => d.__x < lower || d.__x > upper);
        const inside = data.filter(d => d.__x >= lower && d.__x <= upper).sort((a, b) => a.__x - b.__x);
        return {
            y: row.__y,
            p25: row.__x1,
            p75: row.__x2,
            median: row.__x,
            min: inside[0].__x,
            max: inside.at(-1).__x,
            outliers
        };
    }));
</script>

<GroupMultiple class="box-x" length={grouped.length}>
    <RuleY data={boxData} y="y" x1="min" x2="max" />
    <BarX data={boxData} y="y" x1="p25" x2="p75" fill="#ccc" />
    <TickX data={boxData} y="y" x="median" strokeWidth={2} />
    <Dot data={boxData.map(d => d.outliers).flat()} {x} {y} />
</GroupMultiple>