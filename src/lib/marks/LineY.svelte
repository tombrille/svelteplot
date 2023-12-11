<script context="module" lang="ts">
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        Curve,
        DataRow
    } from '$lib/types.js';
    export type LineYMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: RawValue[];
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            // static
            curve?: Curve | CurveFactory;
            tension?: number;
        };
</script>

<script lang="ts">
    import type { RawValue } from '$lib/types.js';
    import type { CurveFactory } from 'd3-shape';
    import Line from './Line.svelte';

    let { data, ...rest } = $props<LineYMarkProps>();
</script>

<Line
    data={data.map((value, index) => ({ value, index, ___orig___: value }))}
    x="index"
    y="value"
    {...rest}
/>
