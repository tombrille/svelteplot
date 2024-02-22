<!--
    @component
    line representing a moving average and an area representing volatility as a band
-->
<script lang="ts">
    import { bollinger } from '$lib/helpers/math.js';
    import { Area, LineY, recordizeY } from '$lib/index.js';
    import type { BaseMarkProps, ChannelAccessor, DataRecord, DataRow } from '$lib/types.js';
    import { resolveChannel } from '../helpers/resolve.js';
    import pick from 'underscore/modules/pick.js';

    type BollingerYProps = BaseMarkProps & {
        data: DataRecord[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        /**
         * the window size (the window transform’s k option), an integer; defaults to 20
         */
        n?: number;
        /**
         * the band radius, a number representing a multiple of standard deviations; defaults to 2
         */
        k?: number;
    };

    let {
        data,
        n = 20,
        k = 2,
        onclick,
        onmouseenter,
        onmouseleave,
        ...options
    } = $props<BollingerYProps>();

    let bands = $derived(
        bollinger(
            data.map((datum: DataRecord) => resolveChannel('y', datum, options)) as number[],
            n,
            [-k, 0, k]
        )
    );
    let args = $derived({
        data: data.map((datum: DataRecord, i: number) => ({
            __x: resolveChannel('x', datum, options),
            __lo: bands[0][i],
            __avg: bands[1][i],
            __hi: bands[2][i]
        })),
        ...options,
        x: '__x',
        y: '__avg',
        x1: '__x',
        y1: '__lo',
        y2: '__hi'
    });


</script>

<g class="bollinger">
    <LineY {...{ x: '__x', y: '__avg', ...pick(args, ['data', 'stroke', 'strokeOpacity', 'opacity']) }} />
    <Area {...{ x1: '__x', y1: '__lo', y2: '__hi', fillOpacity: 0.2, ...pick(args, ['data', 'fill', 'fillOpacity', 'opacity']) }} />
</g>
