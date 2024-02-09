<script lang="ts">
    /**
     * @license
     * SPDX-License-Identifier: AGPL-3.0-or-later
     * Copyright (C) 2024  Gregor Aisch
     */
    import Mark from '../Mark.svelte';
    import { getContext } from 'svelte';
    import type { PlotContext, DataRecord, RectMarkProps } from '../types.js';
    import getBaseStyles from '$lib/helpers/getBaseStyles.js';
    import type { BaseMarkProps } from '../types.js';
    import { resolveProp } from '../helpers/resolve.js';

    let { automatic, ...options } = $props<
        BaseMarkProps &
            RectMarkProps & {
                automatic?: boolean;
            }
    >();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let dx = $derived(resolveProp(options.dx, null, 0));
    let dy = $derived(resolveProp(options.dy, null, 0));
</script>

<Mark type="frame" {automatic}>
    <rect
        transform={dx || dy ? `translate(${dx},${dy})` : null}
        style={getBaseStyles(null, options)}
        style:stroke={options.stroke
            ? resolveProp(options.stroke, {})
            : options.fill
              ? null
              : 'currentColor'}
        x={plot.options.marginLeft}
        y={plot.options.marginTop}
        rx={resolveProp(options.rx, null, null)}
        ry={resolveProp(options.ry, null, null)}
        width={plot.facetWidth}
        height={plot.facetHeight}
    />
</Mark>

<style>
    rect {
        stroke: none;
        fill: none;
    }
</style>
