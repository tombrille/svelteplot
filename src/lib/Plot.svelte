<!--
    @component
    The Plot component is the container for plots. It collects the marks with
    their data and channels and computes the shared scales.
-->
<script lang="ts">
    import Plot from './core/Plot.svelte';

    import type { PlotOptions } from './types.js';

    // implicit marks
    import AxisX from './marks/AxisX.svelte';
    import AxisY from './marks/AxisY.svelte';
    import ColorLegend from './marks/ColorLegend.svelte';
    import Frame from './marks/Frame.svelte';
    import GridX from './marks/GridX.svelte';
    import GridY from './marks/GridY.svelte';
    import SymbolLegend from './marks/SymbolLegend.svelte';
    import FacetAxes from './core/FacetAxes.svelte';

    // automatic scales
    import { autoScale, autoScaleColor } from './helpers/autoScales.js';
    import { namedProjection } from './helpers/autoProjection.js';
    import { isObject } from './helpers/index.js';

    let {
        header: userHeader,
        footer: userFooter,
        overlay,
        underlay,
        children: parentChildren,
        testid,
        facet,
        projection,
        ...restOptions
    }: Partial<PlotOptions> = $props();

    const projectionOpts = $derived.by(() => {
        if (
            projection &&
            typeof projection !== 'function' &&
            typeof projection?.type !== 'function'
        ) {
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

    const scales = $derived(
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

<!-- There's a bug triggering RangeError: Maximum call stack size exceeded 
     when using SveltePlot in ssr, so for now, we're disabling it -->

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
    implicitScales
    {...scales}>
    {#snippet children({
        hasProjection,
        hasExplicitAxisX,
        hasExplicitAxisY,
        hasExplicitGridX,
        hasExplicitGridY,
        options,
        scales,
        ...restProps
    })}
        <!-- implicit axes -->
        {#if !hasProjection && !hasExplicitAxisX}
            {#if options.axes && (options.x.axis === 'top' || options.x.axis === 'both')}
                <AxisX anchor="top" automatic />
            {/if}
            {#if options.axes && (options.x.axis === 'bottom' || options.x.axis === 'both')}
                <AxisX anchor="bottom" automatic />
            {/if}
        {/if}
        {#if !hasProjection && !hasExplicitAxisY}
            {#if options.axes && (options.y.axis === 'left' || options.y.axis === 'both')}
                <AxisY anchor="left" automatic />
            {/if}
            {#if options.axes && (options.y.axis === 'right' || options.y.axis === 'both')}
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
        {@render parentChildren?.({
            options,
            scales,
            ...restProps
        })}
    {/snippet}
    {#snippet facetAxes()}
        <FacetAxes />
    {/snippet}
</Plot>

<style>
    :root {
        --plot-bg: white;
        --plot-fg: currentColor;
    }
</style>
