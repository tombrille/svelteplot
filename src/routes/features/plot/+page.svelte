<script lang="ts">
    import { Plot, GridX, GridY, Line, Frame } from '$lib';
    import { getContext } from 'svelte';
    import type { Datasets } from '$lib/types';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<div class="content">
    <h1>Plot</h1>

    <p>
        The <b>Plot</b> component is the base for each SveltePlot. It takes care of creating the shared
        scales
    </p>

    <Plot grid frame>
        <Frame />
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot grid>
    <Frame />
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />

    <p>You can style plots to look like ggplot:</p>

    <Plot inset={10}>
        <Frame fill="#eaeaea" stroke={null} />
        <GridX stroke="white" />
        <GridY stroke="white" />
        <Line data={aapl} x="Date" y="Close" />
    </Plot>

    <Code
        code={`<Plot inset={10}>
    <Frame fill="#eaeaea" stroke={null}/>
    <GridX stroke="white" />
    <GridY stroke="white" />
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
    />
</div>

<p class="block">
    You can pass <b>title</b>, <b>subtitle</b>, and <b>caption</b> directly as Plot properties:
</p>

<Plot maxWidth="700px" title="Apple stocks" subtitle="Daily stocks" caption="Source: Lorem Ipsum">
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<Code
    code={`<Plot title="Apple stocks" subtitle="Daily stocks" caption="Source: Lorem Ipsum">
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
/>

<p class="block">
    For more flexiblity you can also use the <code>header</code> and <code>footer</code> snippet slots
    to render custom elements inside the figure element
</p>

<Plot grid>
    {#snippet header()}
        <figcaption>Custom caption above the plot</figcaption>
    {/snippet}
    <Line data={aapl} x="Date" y="Close" />
    {#snippet footer()}
        <h2 class="my-hed">This is a plot headline rendered below the plot, and uses custom CSS</h2>
    {/snippet}
</Plot>

<Code
    code={`<Plot grid>
    {#snippet header()}
        <figcaption>Custom caption above the plot</figcaption>
    {/snippet}
    <Line data={aapl} x="Date" y="Close" />
    {#snippet footer()}
        <h2>This is a plot headline rendered below the plot, and uses custom CSS</h2>
    {/snippet}
</Plot>`}
/>

<div class="content">
    <h2 id="plot-options">Plot options</h2>

    <p>jkdfdf</p>

    <ul>
        <li><b>title</b> - you can set the max-width of the plot element</li>
        <li><b>subtitle</b> - you can set the max-width of the plot element</li>
        <li><b>caption</b> - you can set the max-width of the plot element</li>
        <li><b>maxWidth</b> - you can set the max-width of the plot element</li>
    </ul>
</div>

<style>
    figcaption,
    h2.my-hed {
        color: magenta !important;
    }
</style>
