<script lang="ts">
    import { setContext } from 'svelte';
    import type { Margins, FigureProps } from './types';
    import { Frame, GridX, GridY } from '$lib';
    import { Figure } from './classes/Figure.svelte';

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
        marginBottom = 30,
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
        figure.options = { marginBottom, marginLeft, marginRight, marginTop, radius, x, y };
    });
</script>

<figure class="svelteplot" bind:clientWidth={width} style:max-width={maxWidth}>
    {#if header}{@render header()}{/if}

    <svg {width} {height}>
        {#if grid || x?.grid}<GridX />{/if}
        {#if grid || y?.grid}<GridY />{/if}
        {#if frame}<Frame />{/if}
        {#if children}
            <slot {figure} />
        {/if}
    </svg>

    {#if footer}{@render footer()}{/if}
</figure>

<style>
    figure {
        margin: 1em 0;
    }
    svg {
        overflow: visible;
    }
    .svelteplot :global(h2),
    .svelteplot :global(h3) {
        margin: 0 0 0.5ex;
    }
</style>
