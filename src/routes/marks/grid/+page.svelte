<script>
    import { Figure, GridX, GridY } from '$lib';
    import SineRules from '../rule/SineRules.svelte';
</script>

<h1 class="title">Grids</h1>

<p>
    You can let SveltePlot create grids automatically for you by setting the <code>grid</code> flag
    on the <b>Figure</b>:
</p>

<Figure grid x={{ domain: [0, 5] }} y={{ domain: [0, 5] }} />

<pre class="block"><code>{`<Figure grid x={{domain:[0,5]}} y={{domain:[0,5]}} />`}</code></pre>

<p class="block">
    You can turn the grids on individually using by adding <code>grid: true</code> to the x and y scale
    options:
</p>

<div class="columns">
    <div class="column is-half">
        <Figure frame height={300} x={{ domain: [0, 5], grid: true }} />
    </div>
    <div class="column is-half">
        <Figure frame height={300} y={{ domain: [0, 5], grid: true }} />
    </div>
</div>

<pre class="block"><code
        >{`<Figure height={300} x={{ domain: [0, 5], grid: true }} />
<Figure height={300} y={{ domain: [0, 5], grid: true }} />`}</code
    ></pre>

<p class="block">
    Or you can add the <b>GridX</b> and <b>GridY</b> marks explicitely for more options, such as layering
    grids on top of other marks:
</p>

<Figure x={{ domain: [0, 5] }} y={{ domain: [0, 5] }}>
    <GridX stroke="lime" tickFontSize="14px" />
    <GridY stroke="pink" data={[0, 1.5, 2, 2.5, 4, 5]} />
</Figure>

<pre class="block"><code
        >{`<Figure x={{domain:[0,5]}} y={{domain:[0,5]}}>
    <GridX stroke="lime" tickFontSize="14px" />
    <GridY stroke="pink" data={[0,1.5,2,2.5,4,5]} />
</Figure>`}</code
    ></pre>

<p class="block">Use can provide custom tickst to grids:</p>

<SineRules />
