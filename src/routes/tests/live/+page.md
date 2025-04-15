Here's an example where we're binding a live-updated dataset to a line mark. Note how the `<path>` elements rendering the line and area get re-used, and ticks and grid lines get moved around instead of being re-created on every frame:

```svelte live
<script lang="ts">
    import {
        Plot,
        LineY,
        RuleY,
        AreaY,
        Dot,
        Text
    } from '$lib/index.js';
    import { noise } from '$lib/helpers/noise.js';

    let rand: number[] = $state([]);
    let maxLen = $state(200);

    const S = Math.ceil(Math.random() * 1e7);

    // const rand = range(400).map(i => ({ x: i - 200, y: noise(i/20) * 200 - 100 }))
    let mag = $state(1);

    function addLine() {
        do {
            const prevI = rand.length ? rand.at(-1).x : 200;
            mag = Math.pow(
                10,
                Math.floor(Math.log10(prevI) - 2)
            );
            const i = prevI + mag;
            const pt = {
                x: i,
                y:
                    (noise(i / 40 / mag) * 100 - 50) *
                    Math.log10(mag * 10) *
                    5
            };
            rand = [...rand.slice(-maxLen), pt];
        } while (rand.length < 150);
        window.requestAnimationFrame(addLine);
    }

    $effect(async () => {
        if (!rand.length) addLine();
    });
</script>

<Plot
    grid
    marginRight={10}
    marginLeft={35 + Math.log10(mag) * 5}
    inset={10}
    y={{ tickSpacing: 30, nice: true }}
    x={{ tickSpacing: 90, insetRight: 30 }}
    color={{ type: 'categorical' }}
    height={250}>
    <RuleY data={[0]} />
    {#if rand.length > 1}
        <AreaY
            data={rand}
            x="x"
            y="y"
            fill="currentColor"
            opacity={0.1} />
        <LineY
            data={rand}
            x="x"
            y="y"
            stroke="currentColor" />
        <Dot
            data={[rand.at(-1)]}
            x="x"
            y="y"
            fill="currentColor" />
        <Text
            data={[rand.at(-1)]}
            x="x"
            y="y"
            fontWeight="bold"
            stroke="var(--svelteplot-bg)"
            strokeWidth={3}
            fill="currentColor"
            textAnchor="start"
            dx={6}
            text={(d) => d.y.toFixed(0)} />
    {/if}
</Plot>
```
