---
title: Projections
---

```svelte live
<script>
    import { Plot, Dot, Geo, Sphere, Graticule } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';
    import { geoEqualEarth } from 'd3-geo';
    import * as topojson from 'topojson-client';
    
    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(topojson.feature(world, world.objects.land));

    let latitude = $state(40);
    let longitude = $state(120);
</script>

<Slider bind:value={longitude} min={-180} max={180} label="Longitude" />
<Slider bind:value={latitude} min={-90} max={90} label="Latitude" />
<Plot r={{ range: [0.5, 25] }}
    projection={{ 
        type: 'orthographic',
        inset: 10, 
        rotate: [-longitude, -latitude] }}> 
    <Geo data={[land]} fillOpacity="0.2" />
    <Sphere stroke="currentColor" />
    <Dot 
        data={earthquakes}
        stroke="var(--svp-red)"
        fill="var(--svp-red)"
        fillOpacity="0.2"
        x="longitude" 
        y="latitude" 
        r={d => Math.pow(10, d.mag)} />
</Plot>
```

```svelte
<Plot r={{ range: [0.5, 25] }}
    projection={{ 
        type: 'orthographic', 
        inset: 10, 
        rotate: [-longitude, -latitude] }}> 
    <Geo data={[land]} fillOpacity="0.2" />
    <Sphere stroke="currentColor" />
    <Dot 
        data={earthquakes}
        stroke="var(--svp-red)"
        fill="var(--svp-red)"
        fillOpacity="0.2"
        x="longitude" 
        y="latitude" 
        r={d => Math.pow(10, d.mag)} />
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