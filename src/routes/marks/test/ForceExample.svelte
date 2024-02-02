<script lang="ts">
    import { Plot, Arrow, Dot, Text, LineY, RuleY } from '$lib/index.js';
    import { json } from 'd3-fetch';
    import { range } from 'd3-array';
    import { noise } from './noise.js';
    import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

    let links = $state([]);
    let nodes = $state([]);
    let simulation;

    async function loadNetwork() {
        if (!nodes.length) {
            const graph = await json('/data/miserables.json');
            links = graph.links.map((d) => ({ ...d }));
            nodes = graph.nodes.map((d) => ({ ...d }));
            // console.log(nodes)
            simulation = forceSimulation(nodes)
                .alphaTarget(0.3)
                .force(
                    'link',
                    forceLink(links).id((d) => d.id)
                )
                .force('charge', forceManyBody())
                .force('center', forceCenter(0, 50))
                .on('tick', () => {
                    // console.log('tick', {...graph.nodes[0]});
                });
        }
    }

    let rand: number[] = $state([]);

    // const rand = range(400).map(i => ({ x: i - 200, y: noise(i/20) * 200 - 100 }))

    function addLine() {
        const i = rand.length;
        const pt = { x: i - 250, y: noise(i / 20) * 200 - 100 };
        rand = rand.length ? [...rand, pt] : [pt];
        if (rand.length < 500) setTimeout(addLine, 40);
    }

    $effect(async () => {
        // addLine();
    });
</script>

<button onclick={addLine}>start line!</button>
<button onclick={loadNetwork}>boom!</button>

<Plot grid="true" marginRight={20} inset={10} color={{ type: 'categorical' }} height={550}>
    {#if rand.length > 1}
        <LineY data={rand} x="x" y="y" stroke="currentColor" />
    {/if}
    <RuleY data={[0]} />
    {#if nodes.length}
        <Arrow
            data={links}
            x1={(d) => d.source.x}
            y1={(d) => d.source.y}
            x2={(d) => d.target.x}
            y2={(d) => d.target.y}
            bend
            inset="5"
            insetStart={(d) => d.source.id.length * 1.1}
            insetEnd={(d) => d.target.id.length * 1.1}
            opacity="0.2"
        />
        <Dot
            data={nodes}
            r={(d) => d.id.length}
            stroke="var(--svelteplot-bg)"
            fill="group"
            x="x"
            y="y"
        />
    {/if}
</Plot>
