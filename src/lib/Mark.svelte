<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import { deepEqual } from 'fast-equals';

    import { CHANNEL_SCALE } from '$lib/contants.js';
    import type {
        ScaledChannelName,
        Mark,
        MarkType,
        DataRecord,
        PlotContext,
        ChannelName,
        GenericMarkOptions,
        ChannelAccessor,
        BaseMarkProps,
        FacetContext
    } from './types.js';

    type MarkProps = {
        data?: DataRecord[];
        automatic?: boolean;
        type: MarkType;
        channels?: ScaledChannelName[];
        required?: ScaledChannelName[];
        children?: Snippet;
    } & Partial<Record<ChannelName, ChannelAccessor>> &
        Partial<BaseMarkProps>;

    let { data = [], type, channels = [], required = [], ...options }: MarkProps = $props();

    const { addMark, updateMark, removeMark, getTopLevelFacet } =
        getContext<PlotContext>('svelteplot');

    let facet = $derived(getTopLevelFacet());

    const { getFacetState } = getContext<FacetContext>('svelteplot/facet');
    let { left, top } = $derived(getFacetState());

    const mark: Mark<GenericMarkOptions> = {
        id: Symbol(),
        type,
        channels,
        scales: new Set(
            channels
                .filter((channel) => options[channel] !== 0)
                .map((channel) => CHANNEL_SCALE[channel])
        ),
        data,
        options: {
            ...options,
            __firstFacet: left && top
        }
    };

    let mark2 = $state(mark);
    let facetMode = $derived(options.facet || 'auto');

    addMark(mark);

    $effect(() => {
        const opts = { ...options, __firstFacet: left && top };
        if (deepEqual(opts, mark.options)) return;
        mark.options = opts;
        mark2.options = mark.options;
        updateMark(mark);
    });

    let errors = $derived(
        required
            .filter((name) => options[name] == null)
            .map((name) => `missing channel value for ${mark.type} mark: ${name}`)
    );

    $effect(() => {
        for (const name of required) {
            if (options[name] == null) throw new Error(`missing channel value: ${name}`);
        }
    });

    $effect(() => {
        if (deepEqual(data, mark.data)) return;
        mark.data = data;
        mark2.data = data;
        updateMark(mark);
    });

    $effect(() => {
        if (
            facet &&
            facet.data &&
            ((facetMode === 'auto' && facet.data === data) || facetMode === 'include')
        ) {
            mark.options = { fx: facet.x, fy: facet.y, ...options };
            mark2.options = mark.options;
        }
    });

    $effect(() => {
        return () => {
            removeMark(mark);
        };
    });
</script>

{#if errors.length}
    <text transform="translate(10,10)">
        {#each errors as error, i}
            <tspan x="0" dy={i ? 14 : 0}>{error}</tspan>
        {/each}
    </text>
{:else}
    <slot mark={mark2} />
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
