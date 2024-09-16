<!--
    @component
    The Plot component is the container for plots. It collects the marks with
    their data and channels and computes the shared scales.
-->
<script lang="ts">
    import Plot from './core/Plot.svelte';

    import { getContext, setContext } from 'svelte';
    import { SvelteMap } from 'svelte/reactivity';
    import { writable } from 'svelte/store';

    import type {
        PlotOptions,
        GenericMarkOptions,
        Mark,
        PlotScales,
        ScaleName,
        PlotScale,
        PlotDefaults,
        PlotState
    } from './types.js';

    import mergeDeep from './helpers/mergeDeep.js';
    import { computeScales } from './helpers/scales.js';
    import { CHANNEL_SCALE } from './constants.js';

    // implicit marks
    import AxisX from './marks/AxisX.svelte';
    import AxisY from './marks/AxisY.svelte';
    import ColorLegend from './marks/ColorLegend.svelte';
    import Frame from './marks/Frame.svelte';
    import GridX from './marks/GridX.svelte';
    import GridY from './marks/GridY.svelte';
    import SymbolLegend from './marks/SymbolLegend.svelte';

    // automatic scales
    import { autoScale, autoScaleColor } from './helpers/autoScales.js';
    import { namedProjection } from './helpers/autoProjection.js';
    import { isObject } from './helpers/index.js';

    let width = $state(500);

    let {
        header: userHeader,
        footer: userFooter,
        overlay,
        underlay,
        children,
        testid,
        facet,
        projection,
        ...restOptions
    }: Partial<PlotOptions> = $props();

    // information that influences the default plot options
    type PlotOptionsParameters = {
        explicitScales: Set<ScaleName>;
        hasProjection: boolean;
        margins?: number;
        inset?: number;
    };

    let projectionOpts = $derived.by(() => {
        if (projection && typeof projection !== 'function') {
            const { type: projFactory, aspectRatio } = namedProjection(
                isObject(projection) ? projection.type : projection
            );
            return {
                ...(isObject(projection) ? projection : {}),
                type: projFactory,
                aspectRatio
            };
        }
        return projection;
    });

    let scales = $derived(
        Object.fromEntries(
            ['x', 'y', 'r', 'color', 'opacity', 'symbol', 'length', 'fx', 'fy', 'fz'].map(
                (scale) => {
                    const scaleOpts = restOptions[scale] || {};
                    const scaleFn =
                        scaleOpts.scale || (scale === 'color' ? autoScaleColor : autoScale);
                    return [scale, { ...scaleOpts, scale: scaleFn }];
                }
            )
        )
    );
</script>

{#snippet header()}
    {#if restOptions.title}<h2>{restOptions.title}</h2>{/if}
    {#if restOptions.subtitle}<h3>{restOptions.subtitle}</h3>{/if}
    <!-- also pass on user header -->
    {#if userHeader}{@render userHeader()}{/if}
    {#if restOptions.color?.legend}
        <ColorLegend />
    {/if}
    {#if restOptions.symbol?.legend}
        <SymbolLegend />
    {/if}
{/snippet}

{#snippet footer()}
    {#if restOptions.caption}<div>{restOptions.caption}</div>{/if}
    {#if userFooter}{@render userFooter()}{/if}
{/snippet}

<Plot
    {overlay}
    {underlay}
    {...restOptions}
    header={userHeader ||
    restOptions.title ||
    restOptions.subtitle ||
    restOptions.color?.legend ||
    restOptions.symbol?.legend
        ? header
        : null}
    footer={userFooter || restOptions?.caption ? footer : null}
    projection={projectionOpts}
    {...scales}
>
    {#snippet children({
        hasProjection,
        hasExplicitAxisX,
        hasExplicitAxisY,
        hasExplicitGridX,
        hasExplicitGridY,
        options,
        scales,
        width,
        height
    })}
        <!-- implicit axes -->
        {#if !hasProjection && !hasExplicitAxisX}
            {#if options.x.axis === 'top' || options.x.axis === 'both'}
                <AxisX anchor="top" automatic />
            {/if}
            {#if options.x.axis === 'bottom' || options.x.axis === 'both'}
                <AxisX anchor="bottom" automatic />
            {/if}
        {/if}
        {#if !hasProjection && !hasExplicitAxisY}
            {#if options.y.axis === 'left' || options.y.axis === 'both'}
                <AxisY anchor="left" automatic />
            {/if}
            {#if options.y.axis === 'right' || options.y.axis === 'both'}
                <AxisY anchor="right" automatic />
            {/if}
        {/if}
        <!-- implicit grids -->
        {#if !hasExplicitGridX && (options.grid || options.x.grid)}
            <GridX automatic />
        {/if}
        {#if !hasExplicitGridY && (options.grid || options.y.grid)}
            <GridY automatic />
        {/if}
        <!-- implicit frame -->
        {#if options.frame}
            <Frame automatic />
        {/if}
        {#if children}
            {@render children({
                width,
                height,
                options,
                scales
            })}
        {/if}
    {/snippet}
</Plot>

<style>
    :root {
        --plot-bg: white;
        --plot-fg: currentColor;
    }
</style>
