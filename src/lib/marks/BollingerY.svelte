<!--
    @component
    line representing a moving average and an area representing volatility as a band
-->
<script lang="ts">
    import { Area, Line, bollingerY, recordizeY } from '$lib/index.js';
    import type { BaseMarkProps, ChannelAccessor, DataRow } from '$lib/types.js';
    import pick from 'underscore/modules/pick.js';

    type BollingerYProps = BaseMarkProps & {
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

    let { data, n = 20, k = 2, ...options }: BollingerYProps = $props();

    let args = $derived(bollingerY(recordizeY({ data, ...options }), { n, k }));
</script>

<g class="bollinger">
    <Line
        {...{ x: '__x', y: '__avg', ...pick(args, ['data', 'stroke', 'strokeOpacity', 'opacity']) }}
    />
    <Area
        {...{
            x1: '__x',
            y1: '__lo',
            y2: '__hi',
            fillOpacity: 0.2,
            ...pick(args, ['data', 'fill', 'fillOpacity', 'opacity'])
        }}
    />
</g>
