<!--
    @component
    Used by Line and Link marker
-->
<script lang="ts">
    import Marker from './Marker.svelte';
    import { isSnippet, randomId } from '$lib/helpers/index.js';
    import { resolveProp } from '$lib/helpers/resolve.js';
    import type { ConstantAccessor, DataRecord } from '$lib/types.js';
    import type { MouseEventHandler } from 'svelte/elements';
    import { wrapEvent } from '$lib/helpers/wrapEvent.js';

    let {
        datum,
        markerStart,
        markerMid,
        markerEnd,
        marker,
        d,
        style,
        transform,
        color,
        strokeWidth,
        onclick,
        onmouseenter,
        onmouseleave
    } = $props<
        MarkerOptions & {
            datum: DataRecord;
            d: string;
            style: string;
            color: string;
            transform: string;
            strokeWidth: ConstantAccessor<number>;
            onclick: MouseEventHandler<SVGPathElement>;
            onmouseenter: MouseEventHandler<SVGPathElement>;
            onmouseleave: MouseEventHandler<SVGPathElement>;
        }
    >();

    const id = randomId();

    let strokeWidth_ = $derived(resolveProp(strokeWidth, datum, 1.4));
</script>

<g
    {transform}
    stroke-width={strokeWidth_}
    role={onmouseenter || onclick ? 'button' : null}
    onclick={onclick && wrapEvent(onclick, datum)}
    onmouseenter={onmouseenter && wrapEvent(onmouseenter, datum)}
    onmouseleave={onmouseleave && wrapEvent(onmouseleave, datum)}
>
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
    {#if onmouseenter || onclick}
        <!-- add invisible path in bg for easier mouse access -->
        <path
            {d}
            style="fill:none;stroke-width: {(strokeWidth || 1) + 10}; stroke: red; stroke-opacity:0"
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
    />
</g>
