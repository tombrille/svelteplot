<script module>
    export const title = 'Frame Anchor';
</script>

<script lang="ts">
    import { setContext } from 'svelte';

    import { Plot, Text } from 'svelteplot/types';
    import type { PlotDefaults } from 'svelteplot/types';
    setContext<Partial<PlotDefaults>>(
        'svelteplot/defaults',
        {
            frame: {
                strokeOpacity: 0.25
            }
        }
    );
</script>

<Plot
    frame
    height={300}
    axes={false}
    x={{ domain: [0, 10] }}
    y={{ domain: [0, 10] }}>
    {#each ['top', 'bottom', 'center', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as frameAnchor (frameAnchor)}
        <Text
            {frameAnchor}
            fontSize={18}
            text={frameAnchor} />
    {/each}
</Plot>
