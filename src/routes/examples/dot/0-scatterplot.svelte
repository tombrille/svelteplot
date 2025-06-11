<script module>
    export let title = 'Scatterplot';
</script>

<script lang="ts">
    import { Plot, Dot } from 'svelteplot/types';
    import { page } from '$app/state';
    import type { ExamplesData } from '../types';

    let { penguins } = $derived(
        page.data.data
    ) as ExamplesData;
</script>

<Plot>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm" />
</Plot>
