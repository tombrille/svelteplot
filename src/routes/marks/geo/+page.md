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
    let rateMap = $derived(
        new Map(unemployment.map((d) => [d.id, +d.rate]))
    );
    let counties = $derived(
        topojson
            .feature(us, us.objects.counties)
            .features.map((feat) => {
                return {
                    ...feat,
                    properties: {
                        ...feat.properties,
                        unemployment: rateMap.get(+feat.id)
                    }
                };
            })
    );

    let n = $state(5);
</script>

<Slider label="Steps (n)" bind:value={n} min={2} max={11} />
<Plot
    projection="albers-usa"
    color={{
        scheme: 'blues',
        label: 'Unemployment (%)',
        legend: true,
        domain: [1, 5, 8, 10],
        n,
        type: 'threshold'
    }}>
    <Geo
        data={counties}
        fill={(d) => d.properties.unemployment}
        title={(d) =>
            `${d.properties.name}\n${d.properties.unemployment}%`} />
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
    }}>
    <Geo
        data={counties}
        fill={(d) => d.properties.unemployment}
        title={(d) =>
            `${d.properties.name}\n${d.properties.unemployment}%`} />
</Plot>
```

Earthquakes

```svelte live
<script>
    import { Plot, Geo, Sphere } from '$lib';
    import { page } from '$app/stores';
    import * as topojson from 'topojson-client';

    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(
        topojson.feature(world, world.objects.land)
    );
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
        r={(d) => Math.pow(10, d.properties.mag)} />
</Plot>
```

The geo mark’s **geometry** channel can be used to generate geometry from a non-GeoJSON data source.

```svelte live
<script>
    import { Plot, Geo, Sphere } from '$lib';
    import { page } from '$app/stores';
    import * as topojson from 'topojson-client';
    import { geoCircle } from 'd3-geo';
    import { range } from 'd3-array';

    let { world, earthquakes } = $derived($page.data.data);
    let land = $derived(
        topojson.feature(world, world.objects.land)
    );
</script>

<Plot
    color={{
        legend: true,
        label: 'Distance from Tonga (km)'
    }}
    projection={{ type: 'equal-earth', rotate: [90, 0] }}>
    <Sphere stroke="currentColor" />
    <Geo data={[land]} stroke="currentColor" />
    <Geo
        data={[0.5, 179.5].concat(range(10, 171, 10))}
        geometry={geoCircle()
            .center([-175.38, -20.57])
            .radius((r) => r)}
        stroke={(r) => r * 111.2}
        strokeWidth={2} />
</Plot>
```

```svelte
<Plot
    color={{
        legend: true,
        label: 'Distance from Tonga (km)'
    }}
    projection={{ type: 'equal-earth', rotate: [90, 0] }}>
    <Sphere stroke="currentColor" />
    <Geo data={[land]} stroke="currentColor" />
    <Geo
        data={[0.5, 179.5].concat(range(10, 171, 10))}
        geometry={geoCircle()
            .center([-175.38, -20.57])
            .radius((r) => r)}
        stroke={(r) => r * 111.2}
        strokeWidth={2} />
</Plot>
```

Facetting with maps

```svelte live
<script>
    import { Plot, Geo, Text, Frame } from '$lib';
    import { Slider } from '$lib/ui';
    import { page } from '$app/stores';
    import { geoEqualEarth } from 'd3-geo';
    import { union } from 'd3-array';
    import * as topojson from 'topojson-client';

    let { us, presidents } = $derived($page.data.data);

    let statesGeo = $derived(
        new Map(
            topojson
                .feature(us, us.objects.states)
                .features.map((feat) => [+feat.id, feat])
        )
    );
    let years = union(presidents.map((d) => d.year));
    let columns = $state(3);
</script>

<Slider
    bind:value={columns}
    label="Columns:"
    min={2}
    max={4} />
<Plot
    projection="albers-usa"
    color={{
        scheme: 'RdBu',
        legend: true
    }}
    fz={{ columns }}
    marginTop={20}>
    {#snippet children({ scales })}
        <Geo
            data={presidents}
            fz="year"
            fill={(d) => d.DEMOCRAT - d.REPUBLICAN}
            geometry={(d) => statesGeo.get(d.state_fips)} />
        <Text
            fontWeight="bold"
            data={scales.fz.domain}
            frameAnchor="top"
            fz={(d) => d}
            text={(d) => d} />
    {/snippet}
</Plot>
```

```svelte
<Plot
    projection="albers-usa"
    color={{
        scheme: 'RdBu',
        legend: true
    }}
    fz={{ columns }}
    marginTop={20}>
    {#snippet children({ scales })}
        <Geo
            data={presidents}
            fz="year"
            fill={(d) => d.DEMOCRAT - d.REPUBLICAN}
            geometry={(d) => statesGeo.get(d.state_fips)} />
        <Text
            data={scales.fz.domain}
            fontWeight="bold"
            frameAnchor="top"
            fz={(d) => d}
            text={(d) => d} />
    {/snippet}
</Plot>
```

## Geo

## Sphere

## Graticule

The [graticule](https://d3js.org/d3-geo/shape#geoGraticule) helper draws a uniform grid of meridians (lines of constant longitude) and parallels (lines of constant latitude) every 10° between ±80° latitude; for the polar regions, meridians are drawn every 90°. The [sphere](/marks/geo#Sphere) helper draws the outline of the projected sphere.

```svelte live
<script>
    import { Plot, Graticule, Sphere } from '$lib';
    import { Slider } from '$lib/ui';

    let stepX = $state(10);
    let stepY = $state(10);
</script>

<Slider label="stepX" bind:value={stepX} min={1} max={45} />
<Slider label="stepY" bind:value={stepY} min={1} max={45} />

<Plot
    inset={2}
    projection={{
        type: 'orthographic',
        rotate: [0, -30, 20]
    }}>
    <Sphere stroke="currentColor" />
    <Graticule strokeOpacity={0.3} {stepX} {stepY} />
</Plot>
```

```svelte
<Plot
    inset={2}
    projection={{
        type: 'orthographic',
        rotate: [0, -30, 20]
    }}>
    <Sphere stroke="currentColor" />
    <Graticule strokeOpacity={0.3} />
</Plot>
```

You can customize the step size using the following options

- **stepX** - default step size for the minor longitude grid, in degrees
- **stepY** - default step size for the minor latitude grid, in degrees
- **step** - convenience option for setting both _stepX_ and _stepY_
