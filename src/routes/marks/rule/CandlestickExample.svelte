<script lang="ts">
    import { Figure, RuleX } from '$lib';
    import type { Datasets } from '$lib/types';
    import { getContext } from 'svelte';

    let { code = false } = $props();

    const { aapl } = getContext<Datasets>('data');

    type AAPL = (typeof aapl)[0];
</script>

<Figure grid>
    <RuleX data={aapl.slice(750, 800)} x="Date" y1="Low" y2="High" strokeWidth="2" opacity="0.3" />
    <RuleX
        data={aapl.slice(750, 800)}
        x="Date"
        y1="Open"
        y2="Close"
        strokeWidth="5"
        stroke={(d) => ((d as AAPL).Close > (d as AAPL).Open ? 'lightseagreen' : 'crimson')}
    />
</Figure>

{#if code}
    <pre class="block"><code
            >{`<Figure grid>
    <RuleX 
        data={aapl.slice(750, 800)}
        x="Date"
        y1="Low"
        y2="High"
        strokeWidth="2"
        opacity="0.3" />
    <RuleX
        data={aapl.slice(750, 800)}
        x="Date"
        y1="Open"
        y2="Close"
        strokeWidth="5"
        stroke={(d) => d.Close > d.Open ? 'lightseagreen' : 'crimson'} />
</Figure>`}</code
        ></pre>
{/if}
