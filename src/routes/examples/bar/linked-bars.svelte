<script module>
    export const title = 'Linked Bars';
    export const description =
        'A bar chart with linked bars, showing the relationship between two datasets.';
</script>

<script>
    import { Plot, BarX } from 'svelteplot';
    import { page } from '$app/state';
    const data = [
        {
            url: '/marks/line',
            label: 'Line',
            value: 5
        },
        {
            url: '/marks/bar',
            label: 'Bar',
            value: 3
        },
        {
            url: '/marks/dot',
            label: 'Dot',
            value: 4
        }
    ];
</script>

<Plot>
    <BarX
        {data}
        x="value"
        y="label"
        data-sveltekit-noscroll
        href="url" />
</Plot>
