<!--
    @component
    For showing custom HTML tooltips positioned at x/y coordinates
-->
<script context="module" lang="ts">
    import type { ChannelAccessor, DataRow } from '$lib/types.js';
    import type { Snippet } from 'svelte';

    export type HTMLMarkProps = {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
        children: Snippet<{ datum: DataRow; x: number; y: number }>;
    };
</script>

<script lang="ts">
    import { getContext } from 'svelte';
    import type { PlotContext } from '../types.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    import { resolveChannel } from '$lib/helpers/resolve.js';
    import { projectXY } from '$lib/helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';

    let { data = [{}], x, y, children, class: className = null }: HTMLMarkProps = $props();
</script>

{#snippet customMarks()}
    {#each data as datum}
        {@const x_ = resolveChannel('x', datum, { x, y })}
        {@const y_ = resolveChannel('y', datum, { x, y })}
        {#if isValid(x_) && isValid(y_)}
            {@const [px, py] = projectXY(plot.scales, x_, y_)}
            <div
                class="custom-mark-html"
                style:left="{px.toFixed(0)}px"
                style:top="{py.toFixed(0)}px">
                {@render children({ datum, x: px, y: py })}
            </div>
        {/if}
    {/each}
{/snippet}

{#if data.length > 1 || className}
    <div class="g-custom-mark-html {className || ''}">
        {@render customMarks()}
    </div>
{:else}
    {@render customMarks()}
{/if}

<style>
    .custom-mark-html {
        position: absolute;
    }
</style>
