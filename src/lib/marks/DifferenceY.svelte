<script lang="ts">
    import type {
        BaseMarkProps,
        ChannelAccessor,
        ConstantAccessor,
        DataRecord,
        PlotContext
    } from '$lib/types.js';
    import { Line, Area, RuleX } from '$lib';
    import { randomId, coalesce } from '$lib/helpers/index.js';
    import { getContext } from 'svelte';
    import { extent, max, min } from 'd3-array';
    import { resolveChannel } from '$lib/helpers/resolve.js';

    type DifferenceYMarkProps = {
        data: DataRecord[];
        /*
         * the horizontal position of the comparison; bound to the x scale
         */
        x1: ChannelAccessor;
        /**
         * the horizontal position of the metric; bound to the x scale
         */
        x2: ChannelAccessor;
        x: ChannelAccessor;
        /**
         * the vertical position of the comparison; bound to the y scale
         */
        y1: ChannelAccessor;
        /**
         * the vertical position of the metric; bound to the y scale
         */
        y2: ChannelAccessor;
        y: ChannelAccessor;
        positiveFill?: string;
        negativeFill?: string;
    } & BaseMarkProps;

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let { data, ...options }: DifferenceYMarkProps = $props();
    let { x, x1, x2, y, y1, y2 } = $derived(options);

    let cropData = $derived(x1 == null || x2 == null);
    
    let xExtent = $derived(cropData && x != null ? extent(data, d => resolveChannel('x', d, options)) : null);
    let x1Extent = $derived(cropData && x1 != null ? extent(data, d => resolveChannel('x1', d, options)) : null);
    let x2Extent = $derived(cropData && x2 != null ? extent(data, d => resolveChannel('x2', d, options)) : null);

    let maxMin = $derived(max([xExtent, x1Extent, x2Extent].filter(d => d != null).map(d => d[0])));
    let minMax = $derived(min([xExtent, x1Extent, x2Extent].filter(d => d != null).map(d => d[1])));

    $inspect({ cropData, xExtent, x1Extent, x2Extent, maxMin, minMax })

    let croppedX1 = $derived(cropData ? data.filter(d => {
        const x1val = resolveChannel(x1 != null ? 'x1' : 'x', d, options);
        return x1val >= maxMin && x1val <= minMax;
    }) : data);

    let croppedX2 = $derived(cropData ? data.filter(d => {
        const x2val = resolveChannel(x2 != null ? 'x2' : 'x', d, options);
        return x2val >= maxMin && x2val <= minMax;
    }) : data);

    // $inspect({ cropData, xExtent, x1Extent, x2Extent, maxMin, minMax, croppedData })
    $inspect({data, x, x1, x2})


    const id = randomId();
</script>

<g class="positive difference">
    <clipPath id="pos-clip-{id}">
        <Area
            data={croppedX1}
            {...options}
            fill={options.positiveFill || 'red'}
            x1={coalesce(x1, x2, x)}
            y1={{ scale: null, value: 0 }}
            y2={coalesce(y1, x1 === x2 || x1 == null && x2 == null ? 0 : coalesce(y2, y))}
        />
    </clipPath>
    
    <Area
        clipPath="url(#pos-clip-{id})"
        data={croppedX2}
        {...options}
        fill={options.positiveFill || 'pink'}
        x1={coalesce(x2, x)}
        y1={y || y1}
        y2={{ scale: null, value: plot.options.marginTop + plot.facetHeight }}
    />
</g>
<g class="negative difference">
    <clipPath id="neg-clip-{id}">
        <Area
        data={croppedX1}
            {...options}
            fill={options.negativeFill || 'blue'}
            x1={coalesce(x1, x2, x)}
            y1={{ scale: null, value: plot.options.marginTop + plot.facetHeight }}
            y2={coalesce(y1, x1 === x2 || x1 == null && x2 == null ? 0 : coalesce(y2, y))}
        />
    </clipPath> 
    
    <Area
        clipPath="url(#neg-clip-{id})"
        data={croppedX2}
        {...options}
        fill={options.negativeFill || 'cyan'}
        x1={coalesce(x2, x)}
        y1={coalesce(y, y1)}
        y2={{ scale: null, value: 0 }}
    />
</g>
{#if options.stroke !== false}
    <!-- set stroke to false to hide the line -->
    <Line data={croppedX2} {...options} x={coalesce(x2, x)} y={coalesce(y2, y)} />
{/if}
