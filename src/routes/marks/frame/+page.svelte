<script lang="ts">
    import { Plot, Frame, Line } from '$lib/index.js';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Frame</h1>

    <p>
        The <b>frame</b> mark can be used to add a rectangle outside your plot boundaries. The
        easiest way to add a frame is to set the <b>frame</b> option of the Plot element
    </p>
</div>

<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<pre class="block"><code
        >{`<Plot grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}</code
    ></pre>

<p class="block">
    If you need more customization options, you can add the frame manually by explicitely adding the <b
        >Frame</b
    > mark to your plot:
</p>

<Plot grid>
    <Frame fill="yellow" fillOpacity="0.2" stroke="magenta" strokeWidth="2" strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<pre class="block"><code
        >{`<Plot grid>
   <Frame 
        fill="yellow"
        fillOpacity="0.2"
        stroke="magenta"
        strokeWidth="2"
        strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}</code
    ></pre>
