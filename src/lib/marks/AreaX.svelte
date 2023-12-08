<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import isDataRecord from '$lib/helpers/isDataRecord.js';
    import Area from './Area.svelte';

    let { data, x, x1, x2, y, ...rest } = $props<{ data: RawValue[] }>();

    let dataIsRawValueArray = $derived(!isDataRecord(data[0]));

    let transformedData = $derived(dataIsRawValueArray ? 
        data.map((value, index) => ({ value, index, ___orig___: value })) :
        data);

    $inspect({  y1: dataIsRawValueArray ? 'index' : y,
    x1: dataIsRawValueArray ? 0 : x ? 0 : x1,
    x2: dataIsRawValueArray ? 'value' : x ? x : x2 })
</script>

<Area
    data={transformedData}
    y1={dataIsRawValueArray ? 'index' : y}
    x1={dataIsRawValueArray ? 0 : x ? 0 : x1}
    x2={dataIsRawValueArray ? 'value' : x ? x : x2}
    {...rest}
/>
