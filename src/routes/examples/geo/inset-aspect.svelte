<script module>
    export const title = 'Inset and Aspect Ratio';
    export const description =
        'Demonstrates how to use inset and aspect ratio in geographic projections.';
</script>

<script>
    import { Slider } from '$lib/ui';
    import {
        Plot,
        Geo,
        Sphere,
        Graticule
    } from 'svelteplot';
    import { page } from '$app/state';
    import * as topojson from 'topojson-client';
    import { geoCentroid } from 'd3-geo';

    let aspect = $state(0.75);
    let inset = $state(10);

    let { world } = $derived(page.data.data);

    let countries = $derived(
        topojson.feature(world, world.objects.countries)
            .features
    );
    let selected = $state(
        topojson
            .feature(world, world.objects.countries)
            .features.find(
                (d) => d.properties.name === 'Germany'
            )
    );
    let centroid = $derived(geoCentroid(selected));
</script>

<Slider bind:value={inset} min={0} max={50} label="inset" />
<Slider
    bind:value={aspect}
    min={0.35}
    max={2}
    step={0.01}
    label="aspect" />
<Plot
    projection={{
        type: 'transverse-mercator',
        rotate: [-centroid[0], -centroid[1]],
        inset,
        domain: selected
    }}
    height={(w) => w * aspect}>
    <Geo
        data={countries}
        opacity={0.2}
        fill="currentColor"
        href={(d) => `#/${d.properties.name}`}
        stroke="var(--svelteplot-bg)"
        onclick={(d, e) => (selected = e)} />
    <Geo data={[selected]} />
</Plot>
