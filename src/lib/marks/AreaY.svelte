<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import isDataRecord from '$lib/helpers/isDataRecord.js';
    import Area from './Area.svelte';

    let { data, x, y, y1, y2, ...rest } = $props<{ data: RawValue[] }>();

    let dataIsRawValueArray = $derived(!isDataRecord(data[0]));

    let transformedData = $derived(dataIsRawValueArray ? 
        data.map((value, index) => ({ value, index, ___orig___: value })) :
        data);
</script>

<Area
    data={transformedData}
    x1={dataIsRawValueArray ? 'index' : x}
    y1={dataIsRawValueArray ? 0 : y ? 0 : y1}
    y2={dataIsRawValueArray ? 'value' : y ? y : y2}
    {...rest}
/>
