<script lang="ts">
    import { Plot, GridX, GridY, Line } from '$lib';
    import { getContext } from 'svelte';
    import type { Datasets } from '$lib/types';
    import Code from '../../Code.svelte';

    const { aapl } = getContext<Datasets>('data');
</script>

<h1 class="title">Plot</h1>

<p>
    The <b>Plot</b> component is the base for each SveltePlot. It takes care of creating the shared scales
</p>

<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<Code
    code={`<Plot grid>
    <Line data={aapl} x="Date" y="Close" />
</Plot>`}
/>

<p class="block">
    You can pass <b>title</b>, <b>subtitle</b>, and <b>caption</b> directly as Plot properties:
</p>

<Plot title="Apple stocks" subtitle="Daily stocks" caption="Source: Lorem Ipsum">
    <Line data={aapl} x="Date" y="Close" />
</Plot>

<Code
    code={`<Plot title="Apple stocks" subtitle="Daily stocks" caption="Source: Lorem Ipsum>
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
        <h2>This is a plot headline rendered below the plot, and uses custom CSS</h2>
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

<style>
    figcaption,
    h2 {
        color: magenta !important;
    }
</style>
