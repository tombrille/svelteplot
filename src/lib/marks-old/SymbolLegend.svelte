<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte.js';
    import { getContext } from 'svelte';
    import { symbol as d3Symbol } from 'd3-shape';
    import { maybeSymbol } from '$lib/helpers/symbols.js';

    const plot = getContext<Plot>('svelteplot');
</script>

{#if plot.color.manualActiveMarks.length > 0 && !(plot.options.color?.legend && plot.colorSymbolRedundant)}
    <div class="symbol-legend">
        {#each plot.symbolScale.domain() as value}
            {@const symbolV = plot.symbolScale(value)}
            {@const symbolType = maybeSymbol(symbolV)}
            {@const color = plot.colorSymbolRedundant ? plot.colorScale(value) : 'currentColor'}
            <div class="item">
                <div class="swatch">
                    <svg width="15" height="15">
                        <path
                            transform="translate(7.5,7.5)"
                            fill={plot.hasFilledDotMarks ? color : 'none'}
                            stroke={plot.hasFilledDotMarks ? null : color}
                            d={d3Symbol(symbolType, 40)()}
                        />
                    </svg>
                </div>
                <span class="item-label">{value}</span>
            </div>
        {/each}
    </div>
{/if}

<style>
    .symbol-legend {
        text-align: left;
        font-size: 12px;
        display: inline-block;
    }
    .item {
        margin: 0 1em 0.5ex 0;
    }
    path {
        stroke-width: 1.5;
    }
    .item,
    .item-label,
    .swatch {
        display: inline-block;
    }
    .item-label {
        vertical-align: text-bottom;
    }
</style>
