---
title: Geo test
---

Test map:

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
        new Map(topojson.feature(us, us.objects.states).features.map((feat) => [+feat.id, feat]))
    );
    let years = union(presidents.map((d) => d.year));
    let columns = $state(3);
</script>

<Slider bind:value={columns} label="Columns:" min={2} max={4} />
<Plot
    projection="albers-usa"
    color={{
        scheme: 'RdBu',
        legend: true
    }}
    fz={{ columns }}
    marginTop={20}
>
    {#snippet children({ scales })}
        <Geo
            data={presidents}
            fz="year"
            fill={(d) => d.DEMOCRAT - d.REPUBLICAN}
            geometry={(d) => statesGeo.get(d.state_fips)}
        />
        <Text
            fontWeight="bold"
            data={scales.fz.domain}
            frameAnchor="top"
            fz={(d) => d}
            text={(d) => d}
        />
    {/snippet}
</Plot>
```

```svelte --live
<script>
    import { Plot, Geo, Sphere, Line, Dot, GridX, RectY } from '$lib/index';
    import { tick } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { sineInOut } from 'svelte/easing';

    import * as topojson from 'topojson-client';
    import { groups } from 'd3-array';

    import { page } from '$app/stores';
    let { bmi, world } = $derived($page.data.data);

    let bmiCountryMap = $derived(
        new Map(
            groups(bmi, (d) => d.iso).map(([id, rows]) => [
                id,
                new Map(rows.map((row) => [row.year, row.bmi]))
            ])
        )
    );

    let year = tweened(1990, {
        duration: 15000,
        interpolate: (a, b) => (t) => Math.round(a + (b - a) * t)
    });

    let countries = $derived(
        topojson.feature(world, world.objects.regions).features.map((feat) => {
            feat.properties.bmi = bmiCountryMap.get(feat.properties.DW_STATE_CODE);
            return feat;
        })
    );

    let mousePos = $state([0, 0]);
    let hover = $state(null);

    const color = {
        label: 'BMI',
        scheme: 'OrRd',
        n: 6,
        unknown: '#cccccc',
        domain: [10, 20, 30, 40, 50],
        type: 'threshold'
    };

    function animate() {
        year.set(1990, { duration: 0 });
        $year = 2022;
    }
</script>

<h2>{$year}</h2>

<button on:click={animate}>play</button>

<Plot projection="equal-earth" {color}>
    <Geo
        data={countries}
        onmouseenter={(d) => (hover = d)}
        onmousemove={(d, evt) => (mousePos = [evt.layerX, evt.layerY])}
        fill={(d) => d.properties.bmi?.get($year)}
        style="transition: fill 0.2s ease-in-out"
    />

    <Geo
        data={countries.filter(
            (d) => d.properties.DW_STATE_CODE === hover?.properties.DW_STATE_CODE
        )}
        stroke="currentColor"
    />

    {#snippet overlay()}
        {#if hover}
            <div class="tooltip" style:left={`${mousePos[0]}px`} style:top={`${mousePos[1]}px`}>
                <h2>{hover.properties.GERMAN_NAME_NEW}</h2>

                {#if hover.properties.bmi}
                    Anteil Erwachsener mit BMI ab 30 ({$year}):
                    <b>{hover.properties.bmi.get($year).toFixed(1)}%</b>
                    {@const lineData = [...hover.properties.bmi.entries()].map(([k, v]) => ({
                        year: new Date(k, 0, 1),
                        bmi: v
                    }))}
                    <Plot
                        height={110}
                        marginTop={10}
                        marginLeft={5}
                        marginBottom={20}
                        y={{ domain: [0, 50], axis: 'right', grid: false, label: false }}
                        x={{ tickFormat: "'YY" }}
                        color={{ ...color, legend: false }}
                    >
                        <RectY
                            data={[0, 10, 20, 30, 40]}
                            y1={(d) => d}
                            y2={(d) => d + 10}
                            fill={(d) => d + 9}
                        />
                        <GridX stroke="var(--svelteplot-bg)" strokeOpacity={0.5} />
                        <Line data={lineData} x="year" y="bmi" />
                        <Dot
                            data={lineData}
                            filter={(d) => d.year.getFullYear() === $year}
                            fill
                            x="year"
                            y="bmi"
                        />
                    </Plot>
                {/if}
            </div>
        {/if}
    {/snippet}
</Plot>

<style>
    .tooltip {
        width: 200px;
        position: absolute;
        font-size: 11px;
        line-height: 13px;
        background: var(--svelteplot-bg);
        padding: 2ex;
        border: 1px solid #f5f5f5;
        box-shadow: 3px 3px 3px #0000001a;
    }
    .tooltip h2 {
        font-size: 13px;
        margin: 0 0 0.5rem 0 !important;
        padding: 0 !important;
    }
</style>
```
