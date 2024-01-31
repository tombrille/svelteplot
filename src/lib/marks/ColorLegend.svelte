<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import { getContext } from 'svelte';
    import { symbol as d3Symbol, symbol } from 'd3-shape';
    import { maybeSymbol } from '$lib/helpers/symbols.js';
    import type { PlotContext } from '../types.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());
</script>

<!--
    @component
    The ColorLegend is an HTML mark that can be placed in the header, footer and overlay
    snippets. You can activate an implicit ColorLegend above the chart using the global
    color.legend scale option.
-->

{#if plot.scales.color.manualActiveMarks > 0}
    <div class="color-legend">
        {#each plot.scales.color.domain as value}
            {@const symbolV = plot.scales.symbol.fn(value)}
            {@const symbolType = maybeSymbol(symbolV)}
            <div class="item">
                <div class="swatch">
                    <svg width="15" height="15"
                        >{#if plot.colorSymbolRedundant}
                            <path
                                transform="translate(7.5,7.5)"
                                style:fill={plot.hasFilledDotMarks
                                    ? plot.scales.color.fn(value)
                                    : 'none'}
                                style:stroke={plot.hasFilledDotMarks
                                    ? null
                                    : plot.scales.color.fn(value)}
                                d={d3Symbol(symbolType, 40)()}
                            />
                        {:else}
                            <rect style:fill={plot.scales.color.fn(value)} width="15" height="15" />
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
