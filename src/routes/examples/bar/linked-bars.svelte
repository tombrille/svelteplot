<script module>
    export const title = 'Linked Bars';
    export const description =
        'A bar chart with linked bars, showing the relationship between two datasets.';
</script>

<script>
    import { Plot, BarX } from 'svelteplot';
    import { page } from '$app/state';
</script>

<Plot>
    <BarX
        data={[1, 2, 3, 4, 5]}
        href={(d) => `#/${d}`}
        target="_blank" />
</Plot>
