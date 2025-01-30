<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import { deepEqual } from 'fast-equals';

    import { CHANNEL_SCALE } from '$lib/constants.js';
    import type {
        ScaledChannelName,
        Mark as TMark,
        MarkType,
        DataRecord,
        PlotContext,
        ChannelName,
        GenericMarkOptions,
        ChannelAccessor,
        BaseMarkProps,
        FacetContext,
        PlotScale,
        PlotState,
        ScaleName,
        RawValue,
        ScaledDataRecord
    } from './types.js';
    import { getUsedScales, projectXY, projectX, projectY } from './helpers/scales.js';
    import { maybeData, testFilter, isValid } from '$lib/helpers/index.js';
    import { resolveChannel, resolveProp } from './helpers/resolve.js';

    type MarkProps = {
        data?: DataRecord[];
        automatic?: boolean;
        type: MarkType;
        channels?: ScaledChannelName[];
        required?: ScaledChannelName[];
        children?: Snippet<
            [
                {
                    mark: Mark<GenericMarkOptions>;
                    usedScales: ReturnType<typeof getUsedScales>;
                    scaledData: ScaledDataRecord[];
                }
            ]
        >;
        defaults?: Partial<Record<ScaledChannelName, RawValue>>;
    } & Partial<Record<ChannelName, ChannelAccessor>> &
        Partial<BaseMarkProps>;

    let {
        data = [],
        children,
        type,
        channels = [],
        required = [],
        defaults = {},
        ...options
    }: MarkProps = $props();

    const channelsWithFacets: ScaledChannelName[] = $derived([...channels, 'fx', 'fy']);

    const { addMark, removeMark, getTopLevelFacet, getPlotState } =
        getContext<PlotContext>('svelteplot');

    const plot = $derived(getPlotState());
    const facet = $derived(getTopLevelFacet());

    const { getFacetState } = getContext<FacetContext>('svelteplot/facet');
    const { left, top } = $derived(getFacetState());

    class Mark {
        id;
        type;
        channels: ScaledChannelName[] = $state([]);
        scales: Set<ScaleName> = $state(new Set());
        data: DataRecord[] = $state([]);
        options: GenericMarkOptions = $state({});

        constructor(type: MarkType) {
            this.id = Symbol();
            this.type = type;
        }
    }

    const mark = new Mark(type);

    $effect(() => {
        return () => {
            removeMark(mark);
        };
    });

    // let mark2 = $state(mark);
    const facetMode = $derived(options.facet || 'auto');

    const optionsWithAutoFacet = $derived({
        ...options,
        __firstFacet: left && top,
        ...(facet &&
        facet.data &&
        ((facetMode === 'auto' && facet.data === data) || facetMode === 'include')
            ? {
                  fx: facet.x,
                  fy: facet.y
              }
            : {})
    });

    $effect(() => {
        mark.channels = channelsWithFacets;
        mark.scales = new Set(
            channelsWithFacets
                .filter((channel) => options[channel] !== 0)
                .map((channel) => CHANNEL_SCALE[channel])
        );
        mark.data = data;
        console.log($state.snapshot(options))
        mark.options = { ...$state.snapshot(options), __firstFacet: left && top }; //optionsWithAutoFacet;
        addMark(mark);
    });

    const errors = $derived(
        required
            .filter((name) => options[name] == null)
            .map((name) => `missing channel value for ${mark.type} mark: ${name}`)
    );

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    const testFacet = $derived(getTestFacet());

    $effect(() => {
        for (const name of required) {
            if (options[name] == null) throw new Error(`missing channel value: ${name}`);
        }
    });

    const usedScales = $derived(getUsedScales(plot, mark.options, mark));

    /**
     * based on the data and the global scales we can now map the data
     * elements to the scales
     */
    const scaledData = $derived(
        data.flatMap((row) => {
            const channels = options as Record<ChannelName, ChannelAccessor>;
            if (!testFacet(row, channels) || !testFilter(row, channels)) return [];

            const out: ScaledDataRecord = {
                datum: row,
                valid: true
            };
            // compute dx/dy
            const dx = Number(resolveProp<number>(options.dx, out.datum, 0));
            const dy = Number(resolveProp<number>(options.dy, out.datum, 0));
            // iterate over all scaled channels
            for (const [channel, scale] of Object.entries(CHANNEL_SCALE) as [
                ScaledChannelName,
                ScaleName
            ][]) {
                if (plot.scales.projection && (channel === 'x' || channel === 'y') && !out.x) {
                    // special handling for Geo mark which uses geoPath for more
                    // performant projection
                    if (mark.type !== 'geo') {
                        const rx = resolveChannel('x', row, options);
                        const ry = resolveChannel('y', row, options);
                        const [x, y] = projectXY(plot.scales, rx, ry, usedScales.x, usedScales.y);
                        out.x = x;
                        out.y = y;
                        out.valid = out.valid && isValid(rx) && isValid(ry);
                    }
                } else {
                    // check if the mark has defined an accessor for this channel
                    if (options?.[channel]) {
                        // resolve value
                        const value = resolveChannel(channel, row, options);
                        const scaled = usedScales[channel]
                            ? scale === 'x'
                                ? projectX(channel as 'x' | 'x1' | 'x2', plot.scales, value)
                                : scale === 'y'
                                  ? projectY(channel as 'y' | 'y1' | 'y1', plot.scales, value)
                                  : plot.scales[scale].fn(value)
                            : value;
                        out.valid = out.valid && isValid(value);
                        // apply dx/dy transform
                        out[channel] =
                            scale === 'x' && Number.isFinite(scaled)
                                ? (scaled as number) + dx
                                : scaled;
                        out[channel] =
                            scale === 'y' && Number.isFinite(scaled)
                                ? (scaled as number) + dy
                                : scaled;
                    } else if (defaults[channel]) {
                        out[channel] = defaults[channel];
                    }
                }
            }
            return [out];
        })
    );
</script>

{#if errors.length}
    <text transform="translate(10,10)">
        {#each errors as error, i}
            <tspan x="0" dy={i ? 14 : 0}>{error}</tspan>
        {/each}
    </text>
{:else if children}
    {@render children({
        mark,
        usedScales,
        scaledData
    })}
{/if}

<style>
    text {
        stroke: var(--plot-bg);
        fill: crimson;
        font-size: 11px;
        stroke-width: 3px;
        font-weight: bold;
        paint-order: stroke fill;
    }
</style>
