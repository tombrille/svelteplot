<script lang="ts">
    import { setContext } from 'svelte';
    import { CHANNEL_SCALE } from '$lib/contants.js';
    import stringify from '@aitodotai/json-stringify-pretty-compact';
    import type { RawValue, ScaleName, ScaleType } from '$lib/types.js';
    import type { PlotOptions, GenericMarkOptions, Mark, MarkType, PlotScales } from './types.js';

    import mergeDeep from '$lib/helpers/mergeDeep.js';
    import { computeScales } from './helpers/scales.js';
    import { GridX, GridY, Frame, AxisX, AxisY } from './index.js';

    let width = $state(500);

    let { ...initialOpts } = $props<Partial<PlotOptions>>();

    // information that influences the default plot options
    type PlotOptionsParameters = {
        explicitScales: Set<ScaleName>;
    };

    function defaultPlotOptions({ explicitScales }: PlotOptionsParameters): PlotOptions {
        const isOneDimensional = explicitScales.has('x') != explicitScales.has('y');
        const oneDimX = isOneDimensional && explicitScales.has('x');
        const oneDimY = isOneDimensional && explicitScales.has('y');

        return {
            title: '',
            subtitle: '',
            caption: '',
            height: 'auto',
            maxWidth: oneDimY ? '60px' : undefined,
            marginLeft: 30,
            marginRight: oneDimY ? 0 : 30,
            marginTop: oneDimX ? 0 : 35,
            marginBottom: 35,
            inset: isOneDimensional ? 10 : 0,
            grid: false,
            frame: false,
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
                tickSpacing: 80,
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
            symbol: { type: 'ordinal' }
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

    let plotOptions = $derived(extendPlotOptions(initialOpts, { explicitScales }));

    let hasFilledDotMarks = $derived(
        !!explicitMarks.find((d) => d.type === 'dot' && d.options.fill)
    );

    let preScales: PlotScales = $derived(
        computeScales(plotOptions, 400, 400, hasFilledDotMarks, marks)
    );

    let height = $derived(
        plotOptions.height === 'auto'
            ? (isOneDimensional && explicitScales.has('x')
                  ? 60
                  : preScales.y.type === 'band'
                    ? preScales.y.domain.length * 30
                    : preScales.y.type === 'point'
                      ? preScales.y.domain.length * 18
                      : 400) +
                  plotOptions.marginTop +
                  plotOptions.marginBottom
            : plotOptions.height
    );
    let plotHeight = $derived(height - plotOptions.marginTop - plotOptions.marginBottom);
    let plotWidth = $derived(width - plotOptions.marginLeft - plotOptions.marginRight);

    let plotState = $derived({
        options: plotOptions,
        width,
        height,
        plotHeight,
        plotWidth,
        scales: computeScales(plotOptions, width, height, hasFilledDotMarks, marks)
    });

    $inspect({ scales: plotState.scales.y });

    // just for logging
    let marksWoData = $derived(marks.map((mark) => ({ ...mark, data: mark.data.length })));

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
        state() {
            return plotState;
        }
    });
</script>

<figure bind:clientWidth={width} style:max-width={plotOptions.maxWidth}>
    <svg {width} {height}>
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
            <Frame />
        {/if}
        <slot />
    </svg>
</figure>

{JSON.stringify(plotOptions.x.domain)}

<style>
    :root {
        --plot-bg: white;
    }

    figure {
        margin: 0;
        padding: 0;
    }
</style>
