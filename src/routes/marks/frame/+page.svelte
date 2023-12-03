<script lang="ts">
    import { Figure, Frame, Line } from '$lib';
    import type { Datasets } from '$lib/types';
    import { getContext } from 'svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Frame</h1>

    <p>
        The <b>frame</b> mark can be used to add a rectangle outside your plot boundaries. The
        easiest way to add a frame is to set the <b>frame</b> option of the Figure element
    </p>
</div>

<Figure grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Figure>

<pre class="block"><code
        >{`<Figure grid frame>
    <Line data={aapl} x="Date" y="Close" />
</Figure>`}</code
    ></pre>

<p class="block">
    If you need more customization options, you can add the frame manually by explicitely adding the <b
        >Frame</b
    > mark to your plot:
</p>

<Figure grid>
    <Frame fill="yellow" fillOpacity="0.2" stroke="magenta" strokeWidth="2" strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Figure>

<pre class="block"><code
        >{`<Figure grid>
   <Frame 
        fill="yellow"
        fillOpacity="0.2"
        stroke="magenta"
        strokeWidth="2"
        strokeDasharray="4,4" />
    <Line data={aapl} x="Date" y="Close" />
</Figure>`}</code
    ></pre>
