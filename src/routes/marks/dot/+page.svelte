<script lang="ts">
    import AxisY from '$lib/marks/AxisY.svelte';

    import { Figure, GridX, GridY, Dot } from '$lib';
    import DotX from '$lib/marks/DotX.svelte';
    import DotY from '$lib/marks/DotY.svelte';
    import type { Datasets } from '$lib/types';
    import { range } from 'd3-array';
    import { getContext } from 'svelte';

    const { cars } = getContext<Datasets>('data');

    const demoData = [
        { x: 0, y: 0, size: 6 },
        { x: 1, y: 1, size: 5 },
        { x: 2, y: 2, size: 1 },
        { x: 4, y: 3, size: 8 },
        { x: 5, y: 1, size: 5 },
        { x: 6, y: 2, size: 3 },
        { x: 8, y: 0.25, size: 20 },
        { x: 9, y: 2, size: 5 },
        { x: 11, y: 1, size: 3 }
    ];

    let maxRad = $state(10);
</script>

<h1 class="title">Dot mark</h1>

<p>You can use the dot mark to create simple scatterplots:</p>

<Figure grid>
    <Dot data={cars} x="economy (mpg)" y="power (hp)" />
</Figure>

<pre><code
        >{`<script>
    import { Figure, Dot } from 'svelteplot';
</script>

<Figure grid>
    <Dot data={cars} x="economy (mpg)" y="power (hp)"/>
</Figure>`}</code
    ></pre>

<Figure grid radius={{ range: [1, maxRad] }}>
    <Dot
        data={demoData}
        x="x"
        y="y"
        r="size"
        fill={(d) => (d.x < 5 ? 'red' : 'blue')}
        stroke="black"
    />
</Figure>

max radius: <input type="range" bind:value={maxRad} min={0} max={20} /><br />

<p>Using the <b>DotY</b> mark, you can quickly plot a list of numbers as dots:</p>

<Figure height={200}>
    <GridX />
    <GridY />
    <DotY data={range(40).map((d) => Math.sin(d / 5))} />
</Figure>

<p>Using the <b>DotX</b> mark, you can quickly plot a list of numbers as dots:</p>

<div style="width:200px">
    <Figure height={400}>
        <GridY />
        <GridX />
        <DotX data={range(30).map((d) => Math.sin(d / 5))} />
    </Figure>
</div>
