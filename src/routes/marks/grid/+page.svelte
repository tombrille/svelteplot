<script>
    import { Figure, GridX, GridY } from '$lib';
import SineRules from '../rule/SineRules.svelte';
</script>

<h1 class="title">Grids</h1>

<p>You can let SveltePlot create grids automatically for you by setting the <code>grid</code> flag on the <b>Figure</b>:</p>

<Figure grid x={{domain:[0,5]}} y={{domain:[0,5]}} />

<pre class="block"><code
        >{`<Figure grid x={{domain:[0,5]}} y={{domain:[0,5]}}  />`}</code
    ></pre>

<p class="block">Or you add them explicitely for more options:</p>

<Figure x={{domain:[0,5]}} y={{domain:[0,5]}}>
    <GridX stroke="lime" tickFontSize="14px" />
    <GridY stroke="pink" data={[0,1.5,2,2.5,4,5]} />
</Figure>

<pre class="block"><code
        >{`<Figure x={{domain:[0,5]}} y={{domain:[0,5]}}>
    <GridX stroke="lime" tickFontSize="14px" />
    <GridY stroke="pink" data={[0,1.5,2,2.5,4,5]} />
</Figure>`}</code
    ></pre>

<p  class="block">Use can provide custom tickst to grids:</p>

<SineRules />
