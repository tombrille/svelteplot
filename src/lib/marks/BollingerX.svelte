<!--
    @component
    line representing a moving average and an area representing volatility as a band
-->
<script lang="ts">
    import { Area, Line, bollingerX, recordizeX } from '$lib/index.js';
    import type { BaseMarkProps, ChannelAccessor, DataRow } from '$lib/types.js';
    import pick from 'underscore/modules/pick.js';

    type BollingerXProps = BaseMarkProps & {
        data: DataRow[];
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
    } = $props<BollingerXProps>();

    let args = $derived(bollingerX(recordizeX({ data, ...options }), { n, k }));
    $inspect(args)
</script>

<g class="bollinger">
    <Line
        {...{ x: '__avg', y: '__x', ...pick(args, ['data', 'stroke', 'strokeOpacity', 'opacity']) }}
    />
    <Area
        {...{
            y1: '__x',
            x1: '__lo',
            x2: '__hi',
            fillOpacity: 0.2,
            ...pick(args, ['data', 'fill', 'fillOpacity', 'opacity'])
        }}
    />
</g>
