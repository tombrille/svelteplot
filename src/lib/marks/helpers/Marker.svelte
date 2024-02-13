<script context="module" lang="ts">
    export type MarkerShape =
        | 'dot'
        | 'circle'
        | 'circle-stroke'
        | 'arrow'
        | 'arrow-reverse'
        | 'tick'
        | 'tick-x'
        | 'tick-y';
</script>

<script lang="ts">
    let { id, shape, color, strokeWidth } = $props<{ id: string; color: string; strokeWidth: number; shape: MarkerShape }>();

    const tickMarker = (orient: number|'auto') => ({
        viewBox: '-3 -3 6 6', path: 'M0,-3v6', width: 6, height: 6, orient, color: 'stroke'
    })

    const MARKERS: Record<
        MarkerShape,
        {
            path?: string;
            width: number;
            height: number;
            orient: number | 'auto';
            color: 'fill' | 'stroke';
            bg?: 'fill' | 'stroke';
            viewBox?: string;
        }
    > = {
        circle: { width: 6.67, height: 6.67, orient: 0, color: 'fill', bg: 'stroke' },
        dot: { width: 6.67, height: 6.67, orient: 0, color: 'fill'},
        'circle-stroke': { width: 6.67, height: 6.67, orient: 0, color: 'stroke', bg: 'fill' },
        tick: tickMarker('auto'),
        'tick-x': tickMarker(90),
        'tick-y': tickMarker(0),
        arrow: {
            path: 'M-1.5,-3l3,3l-3,3',
            width: 6.67,
            height: 6.67,
            orient: 'auto',
            color: 'stroke'
        },
        'arrow-reverse': {
            path: 'M1.5,-3l-3,3l3,3',
            width: 6.67,
            height: 6.67,
            orient: 'auto',
            color: 'stroke'
        }
    };

    let markerColors = $derived({
        [MARKERS[shape].color]: color,
        ...(MARKERS[shape].bg ? { [MARKERS[shape].bg as string]: 'var(--svelteplot-bg)' } : {})
    });

    function maybePixel(value: string | number) {
        return typeof value === 'number' ? `${value}px` : value;
    }

</script>

<marker
    {id}
    viewBox={ MARKERS[shape].viewBox || '-5 -5 10 10'}
    markerWidth={MARKERS[shape].width}
    orient={MARKERS[shape].orient}
    markerHeight={MARKERS[shape].height}
    stroke-width="1.5"
    {...markerColors}
>
    {#if shape === 'dot' || shape === 'circle' || shape === 'circle-stroke'}
        <circle r="3" />
    {:else}
        <path d={MARKERS[shape].path} />
    {/if}
</marker>


