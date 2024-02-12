<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { setContext } from 'svelte';
    import type { PlotOptions, GenericMarkOptions, Mark, PlotScales, ScaleName } from './types.js';
    import FacetGrid from './FacetGrid.svelte';

    import mergeDeep from '$lib/helpers/mergeDeep.js';
    import { computeScales } from './helpers/scales.js';
    import { GridX, GridY, Frame, AxisX, AxisY, ColorLegend, SymbolLegend } from './index.js';

    let width = $state(500);

    let { header, footer, overlay, underlay, debug, testid, facet, ...initialOpts } =
        $props<Partial<PlotOptions>>();

    // information that influences the default plot options
    type PlotOptionsParameters = {
        explicitScales: Set<ScaleName>;
        margins?: number;
        inset?: number;
    };

    function defaultPlotOptions({
        explicitScales,
        margins,
        inset
    }: PlotOptionsParameters): PlotOptions {
        const isOneDimensional = explicitScales.has('x') != explicitScales.has('y');
        const oneDimX = isOneDimensional && explicitScales.has('x');
        const oneDimY = isOneDimensional && explicitScales.has('y');

        return {
            title: '',
            subtitle: '',
            caption: '',
            height: 'auto',
            maxWidth: oneDimY ? '60px' : undefined,
            marginLeft: margins != null ? margins : 30,
            marginRight: margins != null ? margins : oneDimY ? 0 : 30,
            marginTop: margins != null ? margins : oneDimX ? 0 : 35,
            marginBottom: margins != null ? margins : 35,
            inset: isOneDimensional ? 10 : 0,
            grid: false,
            frame: false,
            projection: null,
            aspectRatio: null,
            facet: {},
            x: {
                type: 'auto',
                axis: oneDimY ? null : 'bottom',
                reverse: false,
                clamp: false,
                nice: false,
                zero: false,
                round: false,
                percent: false,
                padding: 0.1,
                align: 0.5,
                tickSpacing: 80,
                tickFormat: 'auto',
                grid: false
            },
            y: {
                type: 'auto',
                axis: oneDimX ? null : 'left',
                reverse: false,
                clamp: false,
                nice: false,
                zero: false,
                round: false,
                percent: false,
                padding: 0.1,
                align: 0.5,
                tickSpacing: 40,
                tickFormat: 'auto',
                grid: false
            },
            opacity: {
                type: 'linear',
                reverse: false,
                clamp: false,
                nice: false,
                zero: false,
                percent: false,
                padding: 0.1,
                align: 0.5
            },
            r: {
                type: 'sqrt',
                reverse: false,
                clamp: false,
                nice: false,
                zero: true,
                percent: false,
                padding: 0,
                align: 0
            },
            color: { type: 'auto' },
            length: { type: 'linear' },
            symbol: { type: 'ordinal' },
            fx: { type: 'band' },
            fy: { type: 'band' }
        };
    }

    function extendPlotOptions(
        initialOpts: Partial<PlotOptions>,
        opts: PlotOptionsParameters
    ): PlotOptions {
        return mergeDeep<PlotOptions>({}, defaultPlotOptions(opts), initialOpts);
    }

    let marks = $state.frozen<Mark<GenericMarkOptions>[]>([]);

    let explicitMarks = $derived(marks.filter((m) => !m.options.automatic));

    let hasExplicitAxisX = $derived(explicitMarks.find((m) => m.type === 'axisX'));
    let hasExplicitAxisY = $derived(explicitMarks.find((m) => m.type === 'axisY'));
    let hasExplicitGridX = $derived(explicitMarks.find((m) => m.type === 'gridX'));
    let hasExplicitGridY = $derived(explicitMarks.find((m) => m.type === 'gridY'));

    let explicitScales = $derived(
        new Set(explicitMarks.map((m) => [...m.scales.values()]).flat(1))
    );

    let isOneDimensional = $derived(!explicitScales.has('x') || !explicitScales.has('y'));

    let plotOptions = $derived(
        extendPlotOptions(initialOpts, {
            explicitScales,
            margins: initialOpts.margins,
            inset: initialOpts.inset
        })
    );

    let hasFilledDotMarks = $derived(
        !!explicitMarks.find((d) => d.type === 'dot' && d.options.fill)
    );

    let preScales: PlotScales = $derived(
        computeScales(plotOptions, width, 400, hasFilledDotMarks, marks)
    );

    let plotWidth = $derived(width - plotOptions.marginLeft - plotOptions.marginRight);

    let height = $derived(
        plotOptions.height === 'auto'
            ? plotOptions.aspectRatio
                ? ((plotWidth / Math.abs(preScales.x.domain[1] - preScales.x.domain[0])) *
                      Math.abs(preScales.y.domain[1] - preScales.y.domain[0])) /
                      plotOptions.aspectRatio +
                  plotOptions.marginTop +
                  plotOptions.marginBottom
                : ((isOneDimensional && explicitScales.has('x')) || !explicitMarks.length
                      ? 60
                      : preScales.y.type === 'band'
                        ? preScales.y.domain.length * 30
                        : preScales.y.type === 'point'
                          ? preScales.y.domain.length * 18
                          : 350) +
                  plotOptions.marginTop +
                  plotOptions.marginBottom
            : plotOptions.height
    );

    let plotHeight = $derived(height - plotOptions.marginTop - plotOptions.marginBottom);

    let plotBody: HTMLDivElement | undefined = $state(null);

    let facetWidth: number | null = $state(null);
    let facetHeight: number | null = $state(null);

    let plotState = $derived.call(() => {
        const scales = computeScales(
            plotOptions,
            facetWidth || width,
            facetHeight || height,
            hasFilledDotMarks,
            marks
        );
        const colorSymbolRedundant =
            scales.color.uniqueScaleProps.size === 1 &&
            scales.symbol.uniqueScaleProps.size === 1 &&
            [...scales.color.uniqueScaleProps.values()][0] ===
                [...scales.symbol.uniqueScaleProps.values()][0];
        return {
            options: plotOptions,
            width,
            height,
            facetWidth,
            facetHeight,
            plotHeight,
            plotWidth,
            scales,
            colorSymbolRedundant,
            hasFilledDotMarks,
            body: plotBody
        };
    });

    setContext('svelteplot', {
        addMark(mark: Mark<GenericMarkOptions>) {
            marks = [...marks, mark];
        },
        updateMark(mark: Mark<GenericMarkOptions>) {
            marks = marks.map((m) => (m.id === mark.id ? mark : m));
        },
        removeMark(mark: Mark<GenericMarkOptions>) {
            marks = marks.filter((m) => m.id !== mark.id);
        },
        getPlotState() {
            return plotState;
        },
        getTopLevelFacet() {
            // we need to expose the facet options to allow marks to
            // react to state changes by updating the fx and fy channels
            return facet;
        },
        updateDimensions(w: number, h: number) {
            facetWidth = w;
            facetHeight = h;
        }
    });

    $effect(() => {
        if (debug) console.log(plotState.options.x);
    });

    $inspect(plotState.scales.opacity);
</script>

<!--
    @component
    The Plot component is the container for your plot. It collects the marks and computes the shared scales.
-->

<figure bind:clientWidth={width} style:max-width={plotOptions.maxWidth} data-testid={testid}>
    {#if plotOptions.title || plotOptions.subtitle || header || plotOptions.color.legend || plotOptions.symbol.legend}
        <div class="plot-header">
            {#if plotOptions.title}<h2>{plotOptions.title}</h2>{/if}
            {#if plotOptions.subtitle}<h3>{plotOptions.subtitle}</h3>{/if}
            {#if header}{@render header()}{/if}
            {#if plotOptions.color.legend}
                <ColorLegend />
            {/if}
            {#if plotOptions.symbol.legend}
                <SymbolLegend />
            {/if}
        </div>
    {/if}
    <div class="plot-body" bind:this={plotBody}>
        {#if underlay}<div class="plot-underlay">{@render underlay(plotOptions)}</div>{/if}
        <svg {width} {height}>
            <FacetGrid marks={explicitMarks}>
                {#if !hasExplicitAxisX}
                    {#if plotOptions.x.axis === 'top' || plotOptions.x.axis === 'both'}
                        <AxisX anchor="top" automatic />
                    {/if}
                    {#if plotOptions.x.axis === 'bottom' || plotOptions.x.axis === 'both'}
                        <AxisX anchor="bottom" automatic />
                    {/if}
                {/if}
                {#if !hasExplicitAxisY}
                    {#if plotOptions.y.axis === 'left' || plotOptions.y.axis === 'both'}
                        <AxisY anchor="left" automatic />
                    {/if}
                    {#if plotOptions.y.axis === 'right' || plotOptions.y.axis === 'both'}
                        <AxisY anchor="right" automatic />
                    {/if}
                {/if}
                {#if !hasExplicitGridX && (plotOptions.grid || plotOptions.x.grid)}
                    <GridX automatic />
                {/if}
                {#if !hasExplicitGridY && (plotOptions.grid || plotOptions.y.grid)}
                    <GridY automatic />
                {/if}
                {#if plotOptions.frame}
                    <Frame automatic />
                {/if}
                <slot {width} {height} options={plotOptions} />
            </FacetGrid>
        </svg>
        {#if overlay}<div class="plot-overlay">{@render overlay()}</div>{/if}
    </div>
    {#if plotOptions.caption || footer}
        <figcaption class="plot-footer">
            {#if plotOptions.caption}<div>{plotOptions.caption}</div>{/if}
            {#if footer}{@render footer()}{/if}
        </figcaption>
    {/if}
</figure>

<style>
    :root {
        --plot-bg: white;
    }

    figure {
        margin: 0;
        padding: 0;
    }

    .plot-body {
        position: relative;
    }

    .plot-overlay,
    .plot-underlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .plot-underlay {
        z-index: -1;
    }

    .plot-header {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        row-gap: 0.35rem;
    }

    .plot-header :global(h2),
    .plot-header :global(h3) {
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
    }

    .plot-header :global(h3) {
        font-weight: 500;
    }

    .plot-footer {
        margin-bottom: 2rem;
    }

    .plot-footer :global(> div) {
        font-size: 12px;
        font-style: italic;
        opacity: 0.7;
    }
</style>
