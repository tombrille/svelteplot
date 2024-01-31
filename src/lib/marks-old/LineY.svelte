<script context="module" lang="ts">
    import type { MarkProps, BaseMarkStyleProps, ChannelAccessor, Curve } from '$lib/types.js';
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
    import wrapValueArray from '$lib/helpers/wrapValueArray.js';

    let { data, ...rest } = $props<LineYMarkProps>();
</script>

<Line data={wrapValueArray(data)} x="index" y="value" {...rest} />
