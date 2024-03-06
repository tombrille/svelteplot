---
title: Geo mark
---

The **geo mark** draws geographic features — polygons, lines, points, and other geometry — often as thematic maps. It works with SveltePlot’s [projection system](/features/projections). For example, the [choropleth map](https://en.wikipedia.org/wiki/Choropleth_map) below shows unemployment by county in the United States.

```svelte live
<script>
    import { Plot, Geo } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';
    import { geoEqualEarth } from 'd3-geo';
    import * as topojson from 'topojson-client';

    let { us, unemployment } = $derived($page.data.data);
    let rateMap = $derived(new Map(unemployment.map((d) => [d.id, +d.rate])));
    let counties = $derived(
        topojson.feature(us, us.objects.counties).features.map((feat) => {
            feat.properties.unemployment = rateMap.get(+feat.id);
            return feat;
        })
    );

    let n = $state(7);
</script>

<Slider label="Steps (n)" bind:value={n} min={2} max={11} />
<Plot
    projection="albers-usa"
    color={{
        scheme: 'blues',
        label: 'Unemployment (%)',
        legend: true,
        n,
        type: 'quantile'
    }}
>
    <Geo
        data={counties}
        fill={(d) => d.properties.unemployment}
        title={(d) => `${d.properties.name}\n${d.properties.unemployment}%`}
    />
</Plot>
```

```svelte
<Plot
    projection="albers-usa"
    color={{
        scheme: 'blues',
        legend: true,
        label: 'Unemployment (%)',
        n: 7,
        type: 'quantile'
    }}
>
    <Geo
        data={counties}
        fill={(d) => d.properties.unemployment}
        title={(d) => `${d.properties.name}\n${d.properties.unemployment}%`}
    />
</Plot>
```

Earthquakes

```svelte live
<script>
    import { Plot, Geo, Sphere } from '$lib';
    import { page } from '$app/stores';
    import * as topojson from 'topojson-client';

    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(topojson.feature(world, world.objects.land));

    $inspect(land);
</script>

<Plot r={{ range: [0.5, 25] }} projection="equirectangular">
    <Geo data={[land]} fillOpacity="0.2" />
    <Sphere stroke="currentColor" />
    <Geo
        data={earthquakes.features}
        stroke="var(--svp-red)"
        fill="var(--svp-red)"
        fillOpacity="0.2"
        title={(d) => d.properties.title}
        href={(d) => d.properties.url}
        r={(d) => Math.pow(10, d.properties.mag)}
    />
</Plot>
```

The [graticule](/marks/geo#Graticule) helper draws a uniform grid of meridians (lines of constant longitude) and parallels (lines of constant latitude) every 10° between ±80° latitude; for the polar regions, meridians are drawn every 90°. The [sphere](/marks/geo#Sphere) helper draws the outline of the projected sphere.

```svelte live
<script>
    import { Plot, Graticule, Sphere } from '$lib';
    import { page } from '$app/stores';
    import * as topojson from 'topojson-client';

    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(topojson.feature(world, world.objects.land));

    $inspect(land);
</script>

<Plot inset={2} projection={{ type: 'orthographic', rotate: [0, -30, 20]}}>
    <Sphere stroke="currentColor" />
    <Graticule strokeOpacity={0.3}  />
</Plot>
```

```svelte
<Plot inset={2} projection={{ type: 'orthographic', rotate: [0, -30, 20]}}>
    <Sphere stroke="currentColor" />
    <Graticule strokeOpacity={0.3}  />
</Plot>
```

## Geo

## Sphere

## Graticule
