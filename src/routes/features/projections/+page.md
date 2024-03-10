---
title: Projections
---

```svelte live
<script>
    import { Plot, Dot, Geo, Sphere, Line, Graticule } from '$lib';
    import { Slider, Select } from '$lib/ui';
    import { tick } from 'svelte';
    import { page } from '$app/stores';
    import { geoEqualEarth, geoCircle } from 'd3-geo';
    import * as topojson from 'topojson-client';

    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(topojson.feature(world, world.objects.land));

    let latitude = $state(40);
    let longitude = $state(120);
    let dragging = $state(false);
    let zoom = $state(90);

    let vx = $state(0);
    let vy = $state(0);

    let projection = $state('orthographic');
    const options = [
        /* "albers", */
        'azimuthal-equal-area',
        'azimuthal-equidistant',
        /* 'conic-conformal', */
        'conic-equal-area',
        'conic-equidistant',
        'equal-earth',
        'equirectangular',
        'gnomonic',
        /* 'identity', */
        /* 'reflect-y', */
        'mercator',
        'orthographic',
        'stereographic',
        'transverse-mercator'
    ];

    async function step() {
        longitude = longitude + vx;
        latitude = latitude + vy;
        vx *= 0.9;
        vy *= 0.9;
        if (vx < 0.1) vx = 0;
        if (vy < 0.1) vy = 0;
        await tick();
        window.requestAnimationFrame(step);
    }

    let savedLines = $state([]);

    let mouseTrail = $state([]);

    $effect(() => {
        // step();
    });
</script>

<Select bind:value={projection} {options} label="Projection" />
<button
    on:click={() => {
        vx = 10;
        step();
    }}>push</button
>
<button
    on:click={() => {
        savedLines = [...savedLines, ...mouseTrail.map((pt) => [...pt, savedLines.length])];
        mouseTrail = [];
    }}>save line</button
>

<Plot
    r={{ range: [0.5, 25] }}
    projection={{
        type: projection,
        inset: 10,
        domain: geoCircle().center([longitude, latitude]).radius(zoom)(),
        rotate: [-longitude, -latitude]
    }}
    let:scales
>
    <Sphere
        fill="var(--svelteplot-bg)"
        stroke="currentColor"
        cursor="pointer"
        onmousedown={(evt) => {
            if (evt.button === 0) mouseTrail = [];
            dragging = true;
        }}
        onmousemove={(evt) => {
            if (dragging) {
                if (evt.button === 0) {
                    mouseTrail = [
                        ...mouseTrail.slice(-1000),
                        scales.projection.invert([evt.layerX, evt.layerY])
                    ];
                } else if (evt.button === 1) {
                    const z = zoom / 90;
                    latitude = latitude + evt.movementY * z;
                    longitude = longitude - evt.movementX * z;
                }
            }
        }}
        onwheel={(evt) => {
            zoom = Math.max(5, Math.min(90, zoom - evt.wheelDeltaY / 30));
            evt.preventDefault();
        }}
        onmouseup={(evt) => {
            dragging = false;
            if (evt.button === 0) {
                savedLines = [...savedLines, ...mouseTrail.map((pt) => [...pt, savedLines.length])];
                mouseTrail = [];
            }
        }}
    />
    <Graticule pointerEvents="none" opacity="0.1" step={zoom > 50 ? 10 : zoom > 20 ? 5 : 1} />
    <Geo data={[land]} fillOpacity="0.2" pointerEvents="none" />
    <Line
        data={mouseTrail}
        strokeWidth={2}
        stroke={(d) => d[1]}
        x={(d) => d[0]}
        y={(d) => d[1]}
        pointerEvents="none"
    />
    <Line
        data={savedLines}
        opacity={0.3}
        z={(d) => d[2]}
        x={(d) => d[0]}
        y={(d) => d[1]}
        pointerEvents="none"
    />
    <Dot
        data={earthquakes}
        stroke="var(--svp-red)"
        fill="var(--svp-red)"
        fillOpacity="0.2"
        x={(d) => d.geometry.coordinates[0]}
        y={(d) => d.geometry.coordinates[1]}
        r={(d) => Math.pow(10, d.properties.mag)}
    />
</Plot>
```

```svelte
<Plot
    r={{ range: [0.5, 25] }}
    projection={{
        type: 'orthographic',
        inset: 10,
        rotate: [-longitude, -latitude]
    }}
>
    <Sphere
        fill="var(--svelteplot-bg)"
        stroke="currentColor"
        cursor="pointer"
        onmousedown={() => (dragging = true)}
        onmousemove={(d, evt) => {
            if (dragging) {
                latitude = Math.round(latitude + evt.movementY);
                longitude = Math.round(longitude - evt.movementX);
            }
        }}
        onmouseup={() => (dragging = false)}
    />
    <Graticule pointerEvents="none" opacity="0.1" />
    <Geo data={[land]} pointerEvents="none" fillOpacity="0.2" />
    <Dot
        data={earthquakes}
        stroke="var(--svp-red)"
        fill="var(--svp-red)"
        fillOpacity="0.2"
        x="longitude"
        y="latitude"
        r={(d) => Math.pow(10, d.mag)}
    />
</Plot>
```

Above, a [geo mark](/marks/geo) draws polygons representing land and a [sphere mark](/marks/geo#sphere) draws the outline of the globe. A [dot mark](/marks/dot) draws earthquakes as circles sized by magnitude.

The geo mark is “projection aware” so that it can handle all the nuances of projecting spherical polygons to the screen — leaning on [d3-geo](https://d3js.org/d3-geo) to provide [adaptive sampling](https://observablehq.com/@d3/adaptive-sampling) with configurable precision, [antimeridian cutting](https://observablehq.com/@d3/antimeridian-cutting), and clipping. The dot mark is not; instead, Plot applies the projection in place of the _x_ and _y_ scales. Hence, projections work with any mark that consumes continuous **x** and **y** channels — as well as marks that use **x1** & **y1** and **x2** & **y2**. Each mark implementation decides whether to handle projections specially or to treat the projection as any other position scale. (For example, the [line mark](/marks/line) is projection-aware to draw geodesics.)

Plot provides a variety of built-in projections. And as above, all world projections can be rotated to show a different aspect.

```svelte live
<script>
    import { Plot, Geo, Sphere, Graticule } from '$lib';
    import { Select } from '$lib/ui';
    import { page } from '$app/stores';
    import { geoEqualEarth } from 'd3-geo';
    import * as topojson from 'topojson-client';

    let { world } = $derived($page.data.data);
    let land = $derived(topojson.feature(world, world.objects.land));

    let projection = $state('equirectangular');
    const options = [
        /* "albers", */
        'azimuthal-equal-area',
        'azimuthal-equidistant',
        /* 'conic-conformal', */
        'conic-equal-area',
        'conic-equidistant',
        'equal-earth',
        'equirectangular',
        'gnomonic',
        /* 'identity', */
        /* 'reflect-y', */
        'mercator',
        'orthographic',
        'stereographic',
        'transverse-mercator'
    ];
</script>

<Select bind:value={projection} {options} label="Projection" />
<Plot {projection}>
    <Geo data={[land]} />
    <Sphere stroke="currentColor" />
    <Graticule stroke="currentColor" opacity={0.2} />
</Plot>
```

```svelte
<Plot projection="equirectangular">
    <Geo data={[land]} />
    <Sphere stroke="currentColor" />
    <Graticule stroke="currentColor" opacity={0.2} />
</Plot>
```
