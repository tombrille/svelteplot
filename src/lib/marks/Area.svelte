<script context="module" lang="ts">
    export type AreaMarkProps = {
        z?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        curve?: CurveName | CurveFactory;
        tension?: number;
        sort?: ConstantAccessor<RawValue> | { channel: 'stroke' | 'fill' };
        stack?: Partial<StackOptions>;
    };
</script>

<script lang="ts">
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { groups as d3Groups } from 'd3-array';
    import { area, type CurveFactory } from 'd3-shape';
    import callWithProps from '$lib/helpers/callWithProps.js';
    import { maybeCurve } from '$lib/helpers/curves.js';
    import { isValid, maybeData } from '$lib/helpers/index.js';

    import type {
        CurveName,
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import type { RawValue } from '$lib/types.js';
    import { getUsedScales, projectX, projectY } from '../helpers/scales.js';
    import type { StackOptions } from '$lib/transforms/stack.js';

    type AreaProps = BaseMarkProps & {
        data: DataRecord[];
        /**
         * Lorem ipsum
         */
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        y1?: ChannelAccessor;
        y2?: ChannelAccessor;
    } & AreaMarkProps;

    let {
        data,
        /** the curve */
        curve = 'linear',
        tension = 0,
        ...options
    }: AreaProps = $props();

    let data2 = $derived(maybeData(data));

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let groupByKey = $derived(options.z || options.fill || options.stroke);

    let groups = $derived(
        groupByKey ? d3Groups(data2, (d) => resolveProp(groupByKey, d)).map((d) => d[1]) : [data]
    );

    // let sortBy = $derived(sort && isDataRecord(sort) ? sort.channel === 'stroke' ? stroke : fill : sort);
    let sortedGroups = $derived(
        options.sort
            ? groups.sort((a, b) =>
                  resolveChannel('sort', a[0], options) > resolveChannel('sort', b[0], options)
                      ? 1
                      : -1
              )
            : groups
    );

    let areaPath: (d: DataRecord[]) => string = $derived(
        callWithProps(area, [], {
            curve: maybeCurve(curve, tension),
            defined: (d: DataRecord) =>
                options.x1 != null && options.x2 != null
                    ? // vertical

                      isValid(resolveChannel('y1', d, options)) &&
                      isValid(resolveChannel('x1', d, options)) &&
                      isValid(resolveChannel('x2', d, options))
                    : // horizontal
                      isValid(resolveChannel('x1', d, options)) &&
                      isValid(resolveChannel('y1', d, options)) &&
                      isValid(resolveChannel('y2', d, options)),
            ...(options.x1 != null && options.x2 != null
                ? {
                      // "vertical" area
                      x0: (d) => projectX('x1', plot.scales, resolveChannel('x1', d, options)),
                      x1: (d) => projectX('x2', plot.scales, resolveChannel('x2', d, options)),
                      y: (d) => projectY('y', plot.scales, resolveChannel('y1', d, options))
                  }
                : {
                      // "horizontal" area
                      x: (d) => projectX('x', plot.scales, resolveChannel('x1', d, options)),
                      y0: (d) => projectY('y1', plot.scales, resolveChannel('y1', d, options)),
                      y1: (d) => projectY('y2', plot.scales, resolveChannel('y2', d, options))
                  })
        })
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="area"
    data={data2}
    channels={[
        'x1',
        'x2',
        'y1',
        'y2',
        'fx',
        'fy',
        'fill',
        'stroke',
        'opacity',
        'fillOpacity',
        'strokeOpacity'
    ]}
    required={['x1', 'y1']}
    {...options}
    let:mark
>
    {@const useScale = getUsedScales(plot, options, mark)}
    <g class="areas">
        {#each sortedGroups as areaData}
            {#if testFacet(areaData[0], mark.options)}
                {@const dx_ = resolveProp(options.dx, areaData[0], 0)}
                {@const dy_ = resolveProp(options.dy, areaData[0], 0)}
                {#snippet el(datum)}
                    <path
                        d={areaPath(
                            options.filter == null
                                ? areaData
                                : areaData.filter((d) => resolveProp(options.filter, d))
                        )}
                        style={resolveScaledStyles(datum, options, useScale, plot, 'fill')}
                        transform={dx_ || dy_ ? `translate(${dx_},${dy_})` : null}
                    />
                {/snippet}
                {#if options.href}
                    <a
                        href={resolveProp(options.href, areaData[0], '')}
                        target={resolveProp(options.target, areaData[0], '_self')}
                    >
                        {@render el(areaData[0])}
                    </a>
                {:else}
                    {@render el(areaData[0])}
                {/if}
            {/if}
        {/each}
    </g>
</Mark>

<style>
    .lines path {
        stroke-width: 1.4px;
    }
</style>
