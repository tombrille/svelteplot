<script lang="ts" context="module">
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';

    type D3Path = ReturnType<typeof import('d3-path').path>;

    export type ShapeRenderer = {
        draw(context: D3Path, l: number, r: number): void;
    };

    export type VectorMarkProps = BaseMarkProps & {
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
        r?: number;
        length?: ChannelAccessor;
        rotate?: ChannelAccessor;
        fill?: ChannelAccessor;
        stroke?: ChannelAccessor;
        /**
         * Controls where the vector is anchored in relation to the x, y position.
         * If set to 'start', the arrow will start at the x, y position. If set to
         * 'middle', the arrow will be centered at the x, y position. If set to
         * 'end', the arrow will end at the x, y position.
         */
        anchor: 'start' | 'middle' | 'end';
        shape?: 'arrow' | 'spike' | ShapeRenderer;
        children?: Snippet;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
        canvas?: boolean;
    };
</script>

<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import { pathRound as path } from 'd3-path';

    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import { getUsedScales, projectXY } from '../helpers/scales.js';
    import { sort } from '$lib/index.js';
    import Mark from '../Mark.svelte';
    //import DotCanvas from './helpers/DotCanvas.svelte';
    import { maybeData, testFilter, isValid } from '$lib/helpers/index.js';

    const defaultRadius = 3.5;

    // The size of the arrowhead is proportional to its length, but we still allow
    // the relative size of the head to be controlled via the mark’s width option;
    // doubling the default radius will produce an arrowhead that is twice as big.
    // That said, we’ll probably want a arrow with a fixed head size, too.
    const wingRatio = defaultRadius * 5;

    let {
        data,
        canvas,
        shape = 'arrow',
        anchor = 'middle',
        r = defaultRadius,
        ...options
    }: VectorMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());

    const shapeArrow: ShapeRenderer = {
        draw(context: D3Path, l: number, r: number) {
            const wing = (l * r) / wingRatio;
            context.moveTo(0, 0);
            context.lineTo(0, -l);
            context.moveTo(-wing, wing - l);
            context.lineTo(0, -l);
            context.lineTo(wing, wing - l);
        }
    };

    const shapeSpike: ShapeRenderer = {
        draw(context: D3Path, l: number, r: number) {
            context.moveTo(-r, 0);
            context.lineTo(0, -l);
            context.lineTo(r, 0);
        }
    };

    const shapes = new Map([
        ['arrow', shapeArrow],
        ['spike', shapeSpike]
    ]);

    function isShapeObject(value: any): value is ShapeRenderer {
        return value && typeof value.draw === 'function';
    }

    function maybeShape(shape: 'arrow' | 'spike' | ShapeRenderer) {
        if (isShapeObject(shape)) return shape;
        const value = shapes.get(`${shape}`.toLowerCase());
        if (value) return value;
        throw new Error(`invalid shape: ${shape}`);
    }

    function shapePath(shape: 'arrow' | 'spike' | ShapeRenderer, l: number, r: number) {
        const context = path();
        maybeShape(shape).draw(context, l, r);
        return context.toString();
    }

    let args = $derived(
        sort({
            data: maybeData(data),
            // sort by descending radius by default
            ...options
        })
    );
</script>

<Mark
    type="vector"
    required={['x', 'y']}
    channels={[
        'x',
        'y',
        'fx',
        'fy',
        'r',
        'length',
        'symbol',
        'fill',
        'opacity',
        'stroke',
        'fillOpacity',
        'strokeOpacity'
    ]}
    {...args}
>
    {#snippet children({ mark, usedScales })}
        <g class="vector" data-l={usedScales.length}>
            {#if canvas}
                <text x="30" y="30" style="color:red"
                    >implement canvas rendering for vector mark</text
                >
            {:else}
                {#each args.data as datum}
                    {#if testFilter(datum, mark.options) && testFacet(datum, mark.options)}
                        {@const _x = resolveChannel('x', datum, args)}
                        {@const _y = resolveChannel('y', datum, args)}
                        {@const _r = resolveChannel('r', datum, { r: 3, ...args })}
                        {@const _l = resolveChannel('length', datum, { length: 10, ...args })}
                        {#if isValid(_x) && isValid(_y) && isValid(_r)}
                            {@const [x, y] = projectXY(
                                plot.scales,
                                _x,
                                _y,
                                usedScales.x,
                                usedScales.y
                            )}
                            {@const l = usedScales.length ? plot.scales.length.fn(_l) : _l}
                            {#if isValid(x) && isValid(y) && isValid(l)}
                                {@const dx = +resolveProp(args.dx, datum, 0)}
                                {@const dy = +resolveProp(args.dx, datum, 0)}
                                <path
                                    d={shapePath(shape, l, r)}
                                    transform="translate({x + dx}, {y + dy}) rotate({resolveProp(
                                        args.rotate,
                                        datum,
                                        0
                                    )}) {anchor === 'start'
                                        ? ''
                                        : anchor === 'end'
                                          ? `translate(0, ${l})`
                                          : `translate(0, ${l / 2})`}"
                                    style={resolveScaledStyles(
                                        datum,
                                        {
                                            strokeWidth: 1.5,
                                            strokeLinejoin: 'round',
                                            strokeLinecap: 'round',
                                            ...args
                                        },
                                        usedScales,
                                        plot,
                                        'stroke'
                                    )}
                                />
                            {/if}
                        {/if}
                    {/if}
                {/each}
            {/if}
        </g>
    {/snippet}
</Mark>

<style>
    path {
        stroke-width: 1.5px;
    }
</style>
