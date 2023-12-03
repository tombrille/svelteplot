<script lang="ts">
    import { setContext } from 'svelte';
    import type { Margins, FigureProps } from './types';
    import { Frame, GridX, GridY } from '$lib';
    import { DEFAULT_FIGURE_OPTIONS, Figure } from './classes/Figure.svelte';
    import mergeDeep from './helpers/mergeDeep';
    import AxisX from './marks/AxisX.svelte';
    import AxisY from './marks/AxisY.svelte';

    let {
        // snippets
        header,
        footer,
        children,
        // props
        height = 400,
        marginLeft = 30,
        marginRight = 10,
        marginTop = 20,
        marginBottom = 40,
        grid = false,
        frame = false,
        maxWidth = null,
        // scales
        radius = null,
        x = null,
        y = null
    } = $props<FigureProps>();

    let width = $state(400);

    const figure = new Figure(600, 400, {
        marginTop,
        marginLeft,
        marginRight,
        marginBottom,
        radius,
        x,
        y
    });

    setContext('svelteplot', figure);

    $effect(() => {
        figure.width = width;
        figure.height = height;
        figure.options = mergeDeep({}, DEFAULT_FIGURE_OPTIONS, {
            marginBottom,
            marginLeft,
            marginRight,
            marginTop,
            radius,
            x,
            y
        }) as typeof DEFAULT_FIGURE_OPTIONS;
    });
</script>

<figure class="svelteplot" bind:clientWidth={width} style:max-width={maxWidth}>
    {#if header}{@render header()}{/if}

    <svg {width} {height}>
        <!-- automatic grids -->
        {#if grid || x?.grid}<GridX />{/if}
        {#if grid || y?.grid}<GridY />{/if}

        {#if !figure.hasAxisXMark}
            <!-- automatic x axis -->
            {#if figure.options.x.axis === 'bottom' || figure.options.x.axis === 'both'}
                <AxisX anchor="bottom" automatic />
            {/if}
            {#if figure.options.x.axis === 'top' || figure.options.x.axis === 'both'}
                <AxisX anchor="top" automatic />
            {/if}
        {/if}
        {#if !figure.hasAxisYMark}
            <!-- automatic y axis -->
            {#if figure.options.y.axis === 'left' || figure.options.y.axis === 'both'}
                <AxisY anchor="left" automatic />
            {/if}
            {#if figure.options.y.axis === 'right' || figure.options.y.axis === 'both'}
                <AxisY anchor="right" automatic />
            {/if}
        {/if}
        <!-- automatic frame -->
        {#if frame}<Frame />{/if}
        {#if children}
            <slot {figure} />
        {/if}
    </svg>

    <div class="overlay"></div>

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
    .svelteplot :global(h2),
    .svelteplot :global(h3) {
        margin: 0 0 0.5ex;
    }
</style>
