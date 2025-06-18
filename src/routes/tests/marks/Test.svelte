<script lang="ts">
    import { Plot, Arrow } from '$lib/index.js';
    import { page } from '$app/stores';
    let { metros } = $derived($page.data.data);
</script>

<Plot
    grid
    marginRight={20}
    inset={10}
    height={450}
    x={{ type: 'log', label: 'Population' }}
    y={{ label: 'Inequality' }}
    color={{
        scheme: 'BuRd',
        label: 'Change in inequality from 1980 to 2015',
        legend: true
    }}>
    <Arrow
        data={metros}
        x1="POP_1980"
        y1="R90_10_1980"
        x2="POP_2015"
        y2="R90_10_2015"
        bend
        opacity={0.2}
        stroke={(d) => d.R90_10_2015 - d.R90_10_1980} />
</Plot>
