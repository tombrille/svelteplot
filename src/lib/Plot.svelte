<script lang="ts">
    import { setContext } from 'svelte';
    import type { Margins, PlotProps } from './types';
    import { Frame, GridX, GridY } from '$lib';
    import { DEFAULT_PLOT_OPTIONS, Plot } from './classes/Plot.svelte';
    import mergeDeep from './helpers/mergeDeep';
    import AxisX from './marks/AxisX.svelte';
    import AxisY from './marks/AxisY.svelte';

    let {
        // snippets
        header,
        footer,
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
        // scales
        radius = null,
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
        radius,
        x,
        y,
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
            radius,
            x,
            y,
            title,
            subtitle,
            caption
        }) as typeof DEFAULT_PLOT_OPTIONS;
    });

    function onMouseMove(evt) {
        evt.plot = plot;
        onmousemove(evt);
    }
</script>

<figure class="svelteplot" bind:clientWidth={width} style:max-width={maxWidth}>
    <!-- default title -->
    {#if plot.options.title}
        <h2>{@html plot.options.title}</h2>
    {/if}
    {#if plot.options.subtitle}
        <h3>{@html plot.options.subtitle}</h3>
    {/if}
    {#if header}{@render header()}{/if}
    <svg
        role="document"
        {width}
        height={plot.height}
        onmousemove={onmousemove ? onMouseMove : null}
    >
        <!-- automatic grids -->
        {#if grid || x?.grid}<GridX automatic />{/if}
        {#if grid || y?.grid}<GridY automatic />{/if}

        {#if !plot.hasAxisXMark && plot.hasChannelX}
            <!-- automatic x axis -->
            {#if plot.options.x.axis === 'bottom' || plot.options.x.axis === 'both'}
                <AxisX anchor="bottom" automatic />
            {/if}
            {#if plot.options.x.axis === 'top' || plot.options.x.axis === 'both'}
                <AxisX anchor="top" automatic />
            {/if}
        {/if}
        {#if !plot.hasAxisYMark && plot.hasChannelY}
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
        {#if children}
            <slot {plot} />
        {/if}
    </svg>

    <div class="overlay"></div>

    {#if plot.options.caption}
        <figcaption>{@html plot.options.caption}</figcaption>
    {/if}
    {#if footer}{@render footer()}{/if}
</figure>

<style>
    figure {
        margin: 1em 0;
        position: relative;
    }
    svg {
        overflow: visible;
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
