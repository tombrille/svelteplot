<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        DataRow,
        Curve
    } from '$lib/types.js';
    import type { CurveFactory } from 'd3-shape';
    export type AreaXMarkProps = MarkProps &
        BaseMarkStyleProps & {
            x?: ChannelAccessor;
            x1?: ChannelAccessor;
            x2?: ChannelAccessor;
            y?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            curve: Curve | CurveFactory;
            tension: number;
        };
</script>

<script lang="ts">
    import isDataRecord from '$lib/helpers/isDataRecord.js';
    import Area from './Area.svelte';

    let { data, x, x1, x2, y, ...rest } = $props<AreaXMarkProps>();

    let dataIsRawValueArray = $derived(!isDataRecord(data[0]));

    let transformedData = $derived(
        dataIsRawValueArray
            ? (data.map((value, index) => ({ value, index, ___orig___: value })) as DataRow[])
            : data
    );

    $inspect({
        y1: dataIsRawValueArray ? 'index' : y,
        x1: dataIsRawValueArray ? 0 : x ? 0 : x1,
        x2: dataIsRawValueArray ? 'value' : x ? x : x2
    });
</script>

<Area
    data={transformedData}
    y1={dataIsRawValueArray ? 'index' : y}
    x1={dataIsRawValueArray ? 0 : x ? 0 : x1}
    x2={dataIsRawValueArray ? 'value' : x ? x : x2}
    {...rest}
/>
