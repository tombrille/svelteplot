<script module>
    export const title = 'Bended arrows';
</script>

<script lang="ts">
    import { Plot, Arrow, Text } from 'svelteplot';
    import { page } from '$app/state';
    import { setContext } from 'svelte';
    import { type PlotDefaults } from 'svelteplot';
    import type { ExamplesData } from '../types';
    let { metros } = $derived(
        page.data.data
    ) as ExamplesData;

    setContext<Partial<PlotDefaults>>(
        'svelteplot/defaults',
        {
            arrow: {
                headAngle: 45
            }
        }
    );

    let hl: false | (typeof metros)[0] = $state(false);
</script>

<Plot
    grid
    marginRight={20}
    inset={10}
    height={450}
    x={{ type: 'log', label: 'Population' }}
    y={{ label: 'Inequality' }}
    color={{
        label: 'Change in inequality from 1980 to 2015',
        legend: true,
        tickFormat: {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }
    }}>
    <Arrow
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        bend
        style="transition: opacity 0.2s ease-in"
        opacity={{
            scale: null,
            value: (d) =>
                !hl || hl.Metro === d.Metro ? 1 : 0.1
        }}
        onmouseenter={(evt, d) => (hl = d)}
        onmouseleave={() => (hl = null)}
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980} />
    <Text
        data={metros}
        x="POP_2015"
        y="R90_10_2015"
        filter={(d) =>
            hl ? hl.Metro === d.Metro : d.highlight}
        text="nyt_display"
        fill="currentColor"
        stroke="var(--svelteplot-bg)"
        strokeWidth={4}
        lineAnchor="bottom"
        dy={-6} />
</Plot>
