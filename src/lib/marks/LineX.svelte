<script context="module" lang="ts">
    import type { CurveFactory } from 'd3-shape';
    import type {
        MarkProps,
        BaseMarkStyleProps,
        ChannelAccessor,
        Curve,
        RawValue
    } from '$lib/types.js';
    export type LineXMarkProps = MarkProps &
        BaseMarkStyleProps & {
            data: RawValue[];
            sort?: ChannelAccessor | { channel: 'stroke' | 'fill' };
            // static
            curve?: Curve | CurveFactory;
            tension?: number;
        };
</script>

<script lang="ts">
    import wrapValueArray from '$lib/helpers/wrapValueArray.js';
    import Line from './Line.svelte';

    let { data, ...rest } = $props<LineXMarkProps>();
</script>

<Line data={wrapValueArray(data)} x="value" y="index" {...rest} />
