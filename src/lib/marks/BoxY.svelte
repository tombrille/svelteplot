<script lang="ts">
    import GroupMultiple from './helpers/GroupMultiple.svelte';
    import type { BaseMarkProps, ChannelAccessor, DataRow } from '$lib/types.js';
    import { groupX, BarY, TickY, RuleX, Dot } from '$lib/index.js';
    import { resolveChannel } from '$lib/helpers/resolve.js';

    type BoxYProps = {
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
    };

    let { data, x, y }: BoxYProps = $props();

    let { data: grouped } = $derived(groupX(
        { data, x, y, y1: y, y2: y },
        { y: 'median', y1: 'p25', y2: 'p75', fill: rows => rows })
    );

    let boxData = $derived(grouped.map(row => {
        const iqr = row.__y2 - row.__y1;
        const whisker = iqr * 1.5;
        const lower = row.__y1 - whisker;
        const upper = row.__y2 + whisker;
        const data = row.__fill.map(d => ({ ...d, __y: resolveChannel('y', d, { x, y }) }));
        const outliers = data.filter(d => d.__y < lower || d.__y > upper);
        const inside = data.filter(d => d.__y >= lower && d.__y <= upper).sort((a, b) => a.__y - b.__y);
        return {
            x: row.__x,
            p25: row.__y1,
            p75: row.__y2,
            median: row.__y,
            min: inside[0].__y,
            max: inside.at(-1).__y,
            outliers
        };
    }));

    $inspect(boxData)
</script>

<GroupMultiple class="box-y" length={grouped.length}>
    <RuleX data={boxData} x="x" y1="min" y2="max" />
    <BarY data={boxData} x="x" y1="p25" y2="p75" fill="#ddd" stroke="currentColor" />
    <TickY data={boxData} x="x" y="median" strokeWidth={2} />
    <TickY data={boxData} x="x" y="min" strokeWidth={1} />
    <TickY data={boxData} x="x" y="max" strokeWidth={1} inset={10}  />
    <Dot data={boxData.map(d => d.outliers).flat()} {x} {y} />
</GroupMultiple>