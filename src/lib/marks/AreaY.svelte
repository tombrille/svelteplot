<script context="module" lang="ts">
    import type { MarkProps, BaseMarkStyleProps, ChannelAccessor, DataRow } from '$lib/types.js';
    export type AreaYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            x?: ChannelAccessor;
            y?: ChannelAccessor;
            y1?: ChannelAccessor;
            y2?: ChannelAccessor;
            z?: ChannelAccessor;
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
        };
</script>

<script lang="ts">
    import isDataRecord from '$lib/helpers/isDataRecord.js';
    import Area from './Area.svelte';

    let { data, x, y, y1, y2, ...rest } = $props<AreaYMarkProps>();
    let dataIsRawValueArray = $derived(!isDataRecord(data[0]));

    let transformedData = $derived(
        dataIsRawValueArray
            ? (data.map((value, index) => ({ value, index, ___orig___: value })) as DataRow[])
            : data
    );
</script>

<Area
    data={transformedData}
    x1={dataIsRawValueArray ? 'index' : x}
    y1={dataIsRawValueArray ? 0 : y ? 0 : y1}
    y2={dataIsRawValueArray ? 'value' : y ? y : y2}
    {...rest}
/>
