<script module>
    export const title = 'Tick classes';
</script>

<script>
    import { Plot, AxisX } from 'svelteplot';
</script>

<Plot marginTop={30} x={{ domain: [-100, 100] }}>
    <AxisX
        tickClass={(d) =>
            d < 0 ? 'negative' : 'positive'} />
</Plot>

<style>
    :global {
        .tick.negative {
            color: var(--svp-red) !important;
        }
        .tick.positive {
            color: var(--svp-blue) !important;
        }
    }
</style>
