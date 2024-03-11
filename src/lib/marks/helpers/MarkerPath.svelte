<!--
    @component
    Used by Line and Link marker
-->
<script lang="ts">
    import Marker from './Marker.svelte';
    import { isSnippet, randomId } from '$lib/helpers/index.js';
    import { resolveProp } from '$lib/helpers/resolve.js';
    import type { BaseMarkProps, ConstantAccessor, DataRecord, Mark } from '$lib/types.js';
    import { addEvents } from './events.js';

    let {
        datum,
        markerStart,
        markerMid,
        markerEnd,
        marker,
        d,
        style,
        startOffset,
        textStyle,
        text,
        transform,
        color,
        strokeWidth,
        mark
    } = $props<
        MarkerOptions & {
            mark: Mark<BaseMarkProps>;
            datum: DataRecord;
            d: string;
            style: string;
            textStyle: string;
            startOffset: string;
            color: string;
            transform: string;
            text: string;
            strokeWidth: ConstantAccessor<number>;
        }
    >();

    const id = randomId();

    let points = $derived(text ? d.split(/[LMC]/).slice(1) : []);
    let firstPt = $derived(text ? points.at(0).split(',').map(Number) : []);
    let lastPt = $derived(text ? points.at(-1).split(',').map(Number) : []);
    let leftToRight = $derived(text ? firstPt[0] < lastPt.at(-2) : true);
    let pathIsCurve = $derived(text ? d.includes('C') : false);
    // this rather complicated code "reverses" the path to ensure that the text
    // is not turned upside down
    let textPath = $derived(
        !text || leftToRight
            ? d
            : pathIsCurve
              ? [
                    'M',
                    points.at(-1).split(',').slice(-2).join(','),
                    'C',
                    points.at(-1).split(',').slice(2, 4).join(','),
                    ',',
                    points.at(-1).split(',').slice(0, 2).join(','),
                    ',',
                    points[0]
                ].join('')
              : [
                    'M',
                    points.at(-1),
                    ...points
                        .toReversed()
                        .slice(1)
                        .map((pt) => `L${pt}`)
                ].join('')
    );

    let strokeWidth_ = $derived(resolveProp(strokeWidth, datum, 1.4));
</script>

<g {transform} stroke-width={strokeWidth_} use:addEvents={{ options: mark.options, datum }}>
    {#each Object.entries( { start: markerStart, mid: markerMid, end: markerEnd, all: marker } ) as [key, marker]}
        {@const markerId = `marker-${key === 'all' ? '' : `${key}-`}${id}`}
        {#if isSnippet(marker)}
            {@render marker(markerId, color)}
        {:else if marker}
            <Marker
                id={markerId}
                shape={marker === true ? 'circle' : resolveProp(marker, datum)}
                {color}
            />
        {/if}
    {/each}
    {#if mark.options.onmouseenter || mark.options.onclick}
        <!-- add invisible path in bg for easier mouse access -->
        <path
            {d}
            style="fill:none;stroke-width: {(strokeWidth || 1) +
                10}; stroke: transparent; stroke-opacity:0"
        />
    {/if}
    <path
        marker-start={markerStart || marker
            ? `url(#marker-${markerStart ? 'start-' : ''}${id})`
            : null}
        marker-mid={markerMid || marker ? `url(#marker-${markerMid ? 'mid-' : ''}${id})` : null}
        marker-end={markerEnd || marker ? `url(#marker-${markerEnd ? 'end-' : ''}${id})` : null}
        {d}
        {style}
        use:addEvents={{ options: mark.options, datum }}
    />
    {#if text}
        <!-- since textPath.side is not yet supported, we have to use an invisible
            path in order to keep the text from turning upside down -->
        <path d={textPath} {id} stroke="none" fill="none" />
        <text dy="-3" style={textStyle}>
            <textPath {startOffset} href="#{id}">{text}</textPath>
        </text>
    {/if}
</g>

<style>
    text {
        font-size: 12px;
        paint-order: stroke fill;
    }
</style>
