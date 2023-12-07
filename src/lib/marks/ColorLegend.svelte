<script lang="ts">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { getContext } from 'svelte';
    import { symbol as d3Symbol, type SymbolType } from 'd3-shape';
    import { maybeSymbol } from '$lib/helpers/symbols';

    const plot = getContext<Plot>('svelteplot');
</script>

{#if plot.color.manualActiveMarks.length > 0}
<div class="color-legend">
    {#each plot.colorScale.domain() as value}
        {@const symbolV = plot.symbolScale(value)}
        {@const symbolType = maybeSymbol(symbolV)}
        <div class="item">
            <div class="swatch">
                <svg width="15" height="15"
                    >{#if plot.colorSymbolRedundant}
                        <path
                            transform="translate(7.5,7.5)"
                            fill={plot.hasFilledDotMarks ? plot.colorScale(value) : 'none'}
                            stroke={plot.hasFilledDotMarks ? null : plot.colorScale(value)}
                            d={d3Symbol(symbolType, 40)()}
                        />
                    {:else}
                        <rect fill={plot.colorScale(value)} width="15" height="15" />
                    {/if}</svg
                >
            </div>
            <span class="item-label">{value}</span>
        </div>
    {/each}
</div>
{/if}

<style>
    .color-legend {
        text-align: left;
        font-size: 12px;
        display: inline-block;
        margin-right: 2em;
    }
    .item {
        margin: 0 1em 0.5ex 0;
    }
    path { stroke-width: 1.5;}
    .item,
    .item-label,
    .swatch {
        display: inline-block;
    }
    .item-label {
        vertical-align: text-bottom;
    }
</style>
