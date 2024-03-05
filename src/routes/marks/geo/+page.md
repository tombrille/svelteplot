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
    let counties = $derived(topojson.feature(us, us.objects.counties).features.map(feat => {
        feat.properties.unemployment = rateMap.get(+feat.id);
        return feat;
    }));
</script>

<Plot projection="albers-usa" color={{ scheme: 'blues'  }}> 
    <Geo data={counties} fill={d => d.properties.unemployment} />
</Plot>
```

## Geo

## Sphere

## Graticule