<script lang="ts">
    import type { Figure } from '$lib/classes/Figure.svelte';
    // import GroupMultiple from '$lib/helpers/GroupMultiple.svelte';
    import type { GridYMarkProps } from '$lib/types';
    import { getContext } from 'svelte';
    import BaseMark from './BaseMark.svelte';

    const figure = getContext<Figure>('svelteplot');

    let { data = [], title = null, tickFormat = (d) => String(d) } = $props<GridYMarkProps>();

    let ticks = $derived(
        data.length > 0 ? data : figure.yScale.ticks(Math.ceil(figure.plotHeight / 80))
    );

    let autoTitle = $derived(
        figure.y.activeMarks.length === 1 && typeof figure.y.activeMarks[0].props.y === 'string'
            ? figure.y.activeMarks[0].props.y
            : null
    );
    let useTitle = $derived(title || autoTitle);
</script>

<BaseMark type="grid-y" {data} channels={data.length ? ['y'] : []}>
    <g class="grid-y">
        {#if useTitle}
            <text x={0} y={5} class="grid-title" dominant-baseline="hanging">↑ {useTitle}</text>
        {/if}
        {#each ticks as tick}
            <g class="y-tick" transform="translate({figure.margins.left},{figure.yScale(tick)})">
                <text x="-7" dominant-baseline="middle">{tickFormat(tick)}</text>
                <line x2="-5" />
                <line class="grid" x2={figure.width - figure.margins.right - figure.margins.left} />
            </g>
        {/each}
    </g>
</BaseMark>

<style>
    text {
        text-anchor: end;
        font-size: 11px;
        fill: #4a4a4a;
    }
    text.grid-title {
        text-anchor: start;
    }
    .y-tick line {
        stroke: currentColor;
    }
    .y-tick line.grid {
        stroke: #d9d9d9;
    }
</style>
