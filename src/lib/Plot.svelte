<script lang="ts">
    import { setContext } from 'svelte';
    import type { MouseEventHandler } from 'svelte/elements';
    import type { PlotProps } from './types.js';

    import { Frame, GridX, GridY, AxisX, AxisY, ColorLegend, SymbolLegend } from '$lib/index.js';

    import { DEFAULT_PLOT_OPTIONS, Plot } from './classes/Plot.svelte.js';

    import mergeDeep from './helpers/mergeDeep.js';

    let {
        // snippets
        header,
        footer,
        overlay,
        children,
        // props
        height = 'auto',
        marginLeft = 30,
        marginRight = 10,
        marginTop = 20,
        marginBottom = 40,
        inset = null,
        grid = false,
        frame = false,
        maxWidth = null,
        title = '',
        subtitle = '',
        caption = '',
        testid,
        // scales
        radius = null,
        color = null,
        symbol = null,
        x = null,
        y = null,
        onmousemove = null
    } = $props<PlotProps>();

    let width = $state(400);

    const plot = new Plot(600, height || defaultPlotHeight, {
        marginTop,
        marginLeft,
        marginRight,
        marginBottom,
        // scales
        symbol,
        radius,
        x,
        y,
        color,
        // other
        title,
        subtitle,
        caption
    });

    setContext('svelteplot', plot);

    $effect(() => {
        plot.width = width;
        plot._height = height;
        plot.options = mergeDeep({}, DEFAULT_PLOT_OPTIONS, {
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
            inset,
            symbol,
            radius,
            color,
            x,
            y,
            title,
            subtitle,
            caption
        }) as typeof DEFAULT_PLOT_OPTIONS;
    });

    function onMouseMove(evt: MouseEventHandler<SVGElement>) {
        // evt.plot = plot;
        if (onmousemove) onmousemove({ ...evt, plot });
    }

    let hasLegend = $derived(color?.legend || symbol?.legend);
</script>

<figure data-testid={testid} class="svelteplot" bind:clientWidth={width} style:max-width={maxWidth}>
    <svg
        role="document"
        {width}
        height={plot.height}
        onmousemove={onmousemove ? onMouseMove : null}
    >
        <!-- automatic grids -->
        {#if (grid && plot.hasScaleX) || x?.grid}<GridX automatic />{/if}
        {#if (grid && plot.hasScaleY) || y?.grid}<GridY automatic />{/if}

        {#if !plot.hasAxisXMark && (plot.hasScaleX || x?.grid)}
            <!-- automatic x axis -->
            {#if plot.options.x.axis === 'bottom' || plot.options.x.axis === 'both'}
                <AxisX anchor="bottom" automatic />
            {/if}
            {#if plot.options.x.axis === 'top' || plot.options.x.axis === 'both'}
                <AxisX anchor="top" automatic />
            {/if}
        {/if}
        {#if !plot.hasAxisYMark && (plot.hasScaleY || y?.grid)}
            <!-- automatic y axis -->
            {#if plot.options.y.axis === 'left' || plot.options.y.axis === 'both'}
                <AxisY anchor="left" automatic />
            {/if}
            {#if plot.options.y.axis === 'right' || plot.options.y.axis === 'both'}
                <AxisY anchor="right" automatic />
            {/if}
        {/if}
        <!-- automatic frame -->
        {#if frame}<Frame />{/if}
        {#if children}{@render children(plot)}{/if}
    </svg>

    {#if plot.options.title || plot.options.subtitle || header || hasLegend}
        <div class="plot-header">
            {#if plot.options.title}
                <h2>{@html plot.options.title}</h2>
            {/if}
            {#if plot.options.subtitle}
                <h3>{@html plot.options.subtitle}</h3>
            {/if}
            {#if color?.legend}
                <ColorLegend />
            {/if}
            {#if symbol?.legend}
                <SymbolLegend />
            {/if}
            {#if header}{@render header(plot)}{/if}
        </div>
    {/if}

    {#if footer || plot.options.caption}
        <div class="plot-footer">
            {#if plot.options.caption}
                <figcaption>{@html plot.options.caption}</figcaption>
            {/if}
            {#if footer}{@render footer(plot)}{/if}
        </div>
    {/if}

    <div class="overlay">
        {#if overlay}{@render overlay(plot)}{/if}
    </div>
</figure>

<style>
    figure {
        margin: 1em 0;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    figure .plot-header {
        order: 1;
    }
    h2,
    h3 {
        margin: 0;
    }
    svg {
        order: 2;
        overflow: visible;
    }
    figure .plot-footer {
        order: 3;
    }
    .overlay {
        position: absolute;
        pointer-events: none;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
</style>
