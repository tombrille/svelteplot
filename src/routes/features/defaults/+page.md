---
title: Default options
---

SveltePlot defines internal defaults for a lot of its options so you don't have to worry about them in your day-to-day use. However, sometimes you may want to divert from these defaults for _all_ of the plots on your page.

In this case, you can make use of the `svelteplot/defaults` context.

If you're using SveltePlot in a SvelteKit project, you can even set the defaults context in your root layout to ensure the same defaults are being used in your entire site.

```svelte title="+layout.svelte"
<script>
    import { setContext } from 'svelte';

    setContext('svelteplot/defaults', {
        tickSize: 0,
        colorScheme: 'plasma'
    });
</script>

<slot />
```

## Options

| Name                     | Description                                                                                                                                                            | Unit    | Default          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- |
| _height_                 | Plot height                                                                                                                                                            | px      | `350`            |
| _inset_                  | Plot inset                                                                                                                                                             | px      | `0`              |
| _colorScheme_            | Default scheme for color scale                                                                                                                                         | string  | `'turbo'`        |
| _categoricalColorScheme_ | Default scheme for [categorical color scales](/features/color-scales#Categorical-colors)                                                                               | string  | `'observable10'` |
| _unknown_                | Fallback color to be used when mapping NAs to colors s                                                                                                                 | string  | `'#cccccc'`      |
| _tickSize_               | Axis tick line length                                                                                                                                                  | px      | `6`              |
| _tickPadding_            | Distance between tick line and label                                                                                                                                   | px      | `3`              |
| _tickFontSize_           | Tick label font size                                                                                                                                                   | px      | `11`             |
| _axisXAnchor_            | Alignment of AxisX                                                                                                                                                     |         | `'bottom'`       |
| _axisYAnchor_            | Alignment of AxisY                                                                                                                                                     |         | `'left'`         |
| _xTickSpacing_           | Horizontal space between ticks in AxisX and GridX                                                                                                                      | px      | `80`             |
| _yTickSpacing_           | Vertical space between ticks in AxisY and GridY                                                                                                                        | px      | `50`             |
| _graticuleStep_          | Default step size in graticules                                                                                                                                        | degrees | `10`             |
| _locale_                 | Default locale used in axis ticks etc.                                                                                                                                 | string  | `'en-US'`        |
| _numberFormat_           | Default [number format options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options) in axis ticks | object  |                  |
| _css_                    | For passing an `@emotion/css` instance to your plots                                                                                                                   |         |                  |

<style>
    * :global(td) {
        vertical-align: top;
    }
</style>

## CSS Variables

SveltePlot is also relying on CSS variables.

| Name              | Description                   | Unit  | Default |
| ----------------- | ----------------------------- | ----- | ------- |
| _--svelteplot-bg_ | Background color of your page | color | white   |

## Example plot

```svelte live
<script>
    import { Plot, Dot } from 'svelteplot';
    import { page } from '$app/state';
    import { setContext } from 'svelte';

    let { penguins } = $derived(page.data.data);
    setContext('svelteplot/defaults', {
        axis: {
            tickSize: 0,
            tickPadding: 5
        },
        frame: { implicit: true },
        grid: { implicit: true },
        inset: 15,
        categoricalColorScheme: [
            'var(--svp-red)',
            'var(--svp-blue)',
            'var(--svp-green)'
        ],
        dot: {
            r: 5
        }
    });
</script>

<Plot>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        fx="species"
        y="culmen_depth_mm"
        fill="species" />
</Plot>
```

```svelte
<script>
    setContext('svelteplot/defaults', {
        axis: {
            tickSize: 0,
            tickPadding: 5
        },
        frame: { implicit: true },
        grid: { implicit: true },
        inset: 15,
        categoricalColorScheme: [
            'var(--svp-red)',
            'var(--svp-blue)',
            'var(--svp-green)'
        ],
        dot: {
            r: 5
        }
    });
</script>

<Plot>
    <Dot
        data={penguins}
        x="culmen_length_mm"
        fx="species"
        y="culmen_depth_mm"
        fill="species" />
</Plot>
```

You can set mark-specific defaults, too:

```svelte live
<script>
    import { Plot, BarX, AreaY } from 'svelteplot';
    import { page } from '$app/state';
    import { setContext } from 'svelte';

    let { penguins } = $derived(page.data.data);
    setContext('svelteplot/defaults', {
        bar: {
            borderRadius: 4,
            stroke: 'currentColor',
            fill: null
        },
        area: {
            curve: 'basis'
        }
    });
</script>

<Plot>
    <BarX data={[1, 2, 3, 4, 5, 6]} />
</Plot>
<Plot>
    <AreaY data={[1, 3, 2, 4, 6, 5]} />
</Plot>
```
