<script module>
    export const title = 'Custom SVG marks';
</script>

<script lang="ts">
    import { Plot, CustomMark } from 'svelteplot';
    import Spiral from '$lib/ui/Spiral.svelte';
    import { page } from '$app/state';
    import type { ExamplesData } from '../types';
    let { penguins } = $derived(
        page.data.data
    ) as ExamplesData;
</script>

<Plot
    grid
    height={400}
    x={{ domain: [30, 62] }}
    y={{ domain: [13, 21.9] }}>
    <defs>
        <symbol
            id="spiral"
            width="24"
            height="24"
            viewBox="-12 -12 24 24">
            <Spiral
                stroke="currentColor"
                finalRadius={10}
                duration={4} />
        </symbol>
    </defs>
    <CustomMark
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm">
        {#snippet children({ datum })}
            <use
                href="#spiral"
                x="-12"
                y="-12"
                color={datum.species === 'Adelie'
                    ? 'var(--svp-red)'
                    : 'var(--svp-blue)'}
                ><title>{datum.species}</title></use>
        {/snippet}
    </CustomMark>
</Plot>
