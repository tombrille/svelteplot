<script lang="ts">
    import { Plot, Dot } from '$lib/index.js';
    import DotX from '$lib/marks/DotX.svelte';
    import DotY from '$lib/marks/DotY.svelte';
    import type { Datasets } from '$lib/types.js';
    import { getContext } from 'svelte';
    import Code from '../../Code.svelte';

    const { cars, penguins } = getContext<Datasets>('data');

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
    let fill = $state(false);

    const manufactor = (d) => d.name.split(' ')[0];
</script>

<div class="content">
    <h1>Dot mark</h1>

    <p>
        The dot mark draws circles or other symbols positioned in <b>x</b> and <b>y</b> as in a scatterplot.
        For example, the chart below shows the roughly-inverse relationship between car horsepower in
        y↑ and fuel efficiency in miles per gallon in x→.
    </p>

    <input type="checkbox" bind:checked={fill} /> fill symbols

    <Plot grid height={500} testid="cars">
        <Dot
            data={cars}
            x="economy (mpg)"
            y="power (hp)"
            stroke={!fill ? manufactor : null}
            fill={fill ? manufactor : null}
            symbol={manufactor}
        />
    </Plot>

    <Code
        code={`<scri${'pt>'}
    import { Plot, Dot } from 'svelteplot';
</scr${'ipt>'}

<Plot grid>
    <Dot data={cars} x="economy (mpg)" y="power (hp)"/>
</Plot>`}
    />

    <Plot grid height={500} symbol={{ legend: true }} testid="penguins">
        <Dot
            data={penguins}
            x="culmen_length_mm"
            y="culmen_depth_mm"
            stroke="species"
            symbol="species"
        />
    </Plot>

    <Code
        code={`<Plot grid height={500} color={{ legend: true }} symbol={{ legend: true }}>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        y="culmen_depth_mm"
        stroke="species"
        symbol="species"
    />
</Plot>`}
    />

    <Plot grid radius={{ range: [1, maxRad] }}>
        <Dot
            data={demoData}
            x="x"
            y="y"
            r="size"
            fill={(d) => (d.x < 5 ? 'red' : 'blue')}
            stroke="black"
        />
    </Plot>

    max radius: <input type="range" bind:value={maxRad} min={0} max={20} /><br />

    <p>Using the <b>DotX</b> mark, you can quickly plot a list of numbers as dots:</p>

    <Plot testid="dotx">
        <DotX data={cars.map((d) => d['economy (mpg)'])} />
    </Plot>

    <p>Using the <b>DotY</b> mark, you can quickly plot a list of numbers as dots:</p>

    <Plot testid="doty">
        <DotY data={cars.map((d) => d['economy (mpg)'])} />
    </Plot>
</div>
