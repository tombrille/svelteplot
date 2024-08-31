<!--
    @component
    For showing custom HTML tooltips positioned at x/y coordinates
-->
<script context="module" lang="ts">
    import type { ChannelAccessor, DataRow } from '$lib/types.js';

    export type HTMLMarkProps = {
        data: DataRow[];
        x?: ChannelAccessor;
        y?: ChannelAccessor;
    };
</script>

<script lang="ts">
    import { getContext } from 'svelte';
    import type { PlotContext } from '../types.js';

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    import { resolveChannel } from '$lib/helpers/resolve.js';
    import { projectX, projectY } from '$lib/helpers/scales.js';
    import { isValid } from '$lib/helpers/index.js';

    let { data, x, y }: HTMLMarkProps = $props();
</script>

{#each data as datum}
    {@const x_ = resolveChannel('x', datum, { x, y })}
    {@const y_ = resolveChannel('y', datum, { x, y })}
    {#if isValid(x_) && isValid(y_)}
        <div
            class="custom-mark-html"
            style:left="{projectX('x', plot.scales, resolveChannel('x', datum, { x, y }))}px"
            style:top="{projectY('y', plot.scales, resolveChannel('y', datum, { x, y }))}px"
        >
            <slot {datum} />
        </div>
    {/if}
{/each}

<style>
    .custom-mark-html {
        position: absolute;
    }
</style>
