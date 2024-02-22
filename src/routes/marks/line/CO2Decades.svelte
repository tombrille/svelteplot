<script lang="ts">
    import { Plot, Line, Text, RectY, RuleY } from '$lib';
    import { groups, range } from 'd3-array';
    import { scaleLinear } from 'd3-scale';
    import { interpolateLab } from 'd3-interpolate';
    import { page } from '$app/stores';
    import { AxisX, AxisY } from '$lib/index.js';

    let { co2 } = $derived($page.data.data);

    const addDecade = (d: { date: Date }) => {
        const y = d.date.getFullYear();
        const decadeBaseYear = y - (y % 10);
        const yearInDecade = y - decadeBaseYear + d.date.getMonth() / 12;
        return { ...d, decadeBaseYear, yearInDecade };
    };

    let co2decades = $derived(co2.map(addDecade));

    let lastOfDecade = $derived(
        groups(co2decades, (d) => d.decadeBaseYear)
            .map(([, v]) => v.at(-1))
            .map((d) => ({
                ...d,
                label: `${Math.max(d.decadeBaseYear, co2[0].date.getFullYear())}-'${String(Math.min(d.decadeBaseYear + 9, co2.at(-1).date.getFullYear())).substring(2)}`
            }))
    );

    const annotations = [{ x: 0, y: 350, text: 'Sustainable level' }];
</script>

<Plot
    x={{
        label: 'Year in decade →',
        grid: true,
        ticks: range(1, 10)
    }}
    y={{ label: '↑ CO2 concentration (in ppm)', interval: 20 }}
    height={550}
    marginTop={25}
    marginBottom={35}
    marginRight={80}
    color={{
        legend: true,
        scheme: ['#2f8fe3', '#a09ebc', '#c28b81', '#c06146', '#a62a1b'],
        type: 'linear'
    }}
>
    <AxisY tickSize={0} />

    <RectY
        data={range(310, 420, 20).map((low) => ({ low, high: low + 10 }))}
        y1="low"
        y2="high"
        opacity={0.05}
    />

    <RuleY data={[350]} strokeWidth={3} opacity={0.2} />

    <Line
        data={co2decades}
        markerStart="dot"
        markerEnd="dot"
        z="decadeBaseYear"
        x="yearInDecade"
        stroke="average"
        strokeWidth="1.7"
        y="average"
    />

    <Text
        data={lastOfDecade}
        x="yearInDecade"
        y="average"
        text="label"
        textAnchor="start"
        dx="8"
        stroke="var(--svelteplot-bg)"
        strokeWidth={3}
        fill="average"
    />

    <Text
        data={annotations}
        x="x"
        y="y"
        text="text"
        textAnchor="start"
        lineAnchor="top"
        dy="3"
        fontStyle="italic"
        opacity={0.5}
    />
</Plot>
