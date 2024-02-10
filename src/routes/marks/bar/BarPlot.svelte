<script lang="ts">
    import { Plot, BarY, RuleY } from '$lib';
    import { getContext } from 'svelte';

    const getData = getContext('data');
    let { alphabet } = $derived(getData());
</script>

<Plot grid y={{ percent: true }} marginTop={25}>
    <RuleY data={[0]} />
    <BarY data={alphabet} x="letter" y="frequency" />
</Plot>
