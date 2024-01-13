<script lang="ts">
    import { Plot, BarY, RuleY } from 'svelteplot';
    import { getContext } from 'svelte';

    const { alphabet } = getContext<Datasets>('data');
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y1={0} y2="frequency" />
</Plot>
