<script lang="ts">
    import type {
        Mark,
        BaseMarkProps,
        PlotContext,
        ScaledDataRecord,
        UsedScales
    } from '$lib/types.js';
    import { CSS_VAR } from '$lib/constants.js';
    import { resolveProp, resolveScaledStyleProps } from '$lib/helpers/resolve.js';
    import { getContext, untrack } from 'svelte';
    import { type GeoPath } from 'd3-geo';
    import CanvasLayer from './CanvasLayer.svelte';
    import type { Attachment } from 'svelte/attachments';
    import { devicePixelRatio } from 'svelte/reactivity/window';
    import { GEOJSON_PREFER_STROKE } from '$lib/helpers/index.js';

    let {
        mark,
        data,
        path,
        usedScales
    }: {
        mark: Mark<BaseMarkProps>;
        data: ScaledDataRecord[];
        path: GeoPath;
        usedScales: UsedScales;
    } = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    const plot = $derived(getPlotState());

    function maybeOpacity(value) {
        return value == null ? 1 : +value;
    }

    const render: Attachment = (canvas: HTMLCanvasElement) => {
        const context = canvas.getContext('2d');

        $effect(() => {
            path.context(context);
            if (context) {
                context.resetTransform();
                context.scale(devicePixelRatio.current ?? 1, devicePixelRatio.current ?? 1);
                let currentColor;

                for (const d of data) {
                    if (!d.valid) continue;
                    const geometry = resolveProp(mark.options.geometry, d.datum, d.datum);
                    // untrack the filter test to avoid redrawing when not necessary
                    let { stroke, fill, ...restStyles } = resolveScaledStyleProps(
                        d.datum,
                        mark.options,
                        usedScales,
                        plot,
                        GEOJSON_PREFER_STROKE.has(geometry.type) ? 'stroke' : 'fill'
                    );

                    const opacity = maybeOpacity(restStyles['opacity']);
                    const fillOpacity = maybeOpacity(restStyles['fill-opacity']);
                    const strokeOpacity = maybeOpacity(restStyles['stroke-opacity']);

                    if (`${fill}`.toLowerCase() === 'currentcolor')
                        fill =
                            currentColor ||
                            (currentColor = getComputedStyle(
                                canvas?.parentElement?.parentElement
                            ).getPropertyValue('color'));
                    if (`${stroke}`.toLowerCase() === 'currentcolor')
                        stroke =
                            currentColor ||
                            (currentColor = getComputedStyle(
                                canvas?.parentElement?.parentElement
                            ).getPropertyValue('color'));
                    if (CSS_VAR.test(fill))
                        fill = getComputedStyle(canvas).getPropertyValue(fill.slice(4, -1));
                    if (CSS_VAR.test(stroke))
                        stroke = getComputedStyle(canvas).getPropertyValue(stroke.slice(4, -1));

                    if (stroke && stroke !== 'none') {
                        const strokeWidth = resolveProp(mark.options.strokeWidth, d.datum, 1);
                        context.lineWidth = strokeWidth ?? 1;
                    }

                    context.fillStyle = fill ? fill : 'none';
                    context.strokeStyle = stroke ? stroke : 'none';

                    context.beginPath();

                    path(geometry);
                    context.closePath();

                    if (opacity != null) context.globalAlpha = opacity;
                    if (fillOpacity != null) context.globalAlpha = opacity * fillOpacity;

                    if (fill && fill !== 'none') context.fill();
                    if (strokeOpacity != null) context.globalAlpha = opacity * strokeOpacity;
                    if (stroke && stroke !== 'none') context.stroke();
                }
            }
            // reset path context in case we switch back to SVG
            path.context(null);
            return () => {
                context?.clearRect(
                    0,
                    0,
                    plot.width * (devicePixelRatio.current ?? 1),
                    plot.height * (devicePixelRatio.current ?? 1)
                );
            };
        });
    };

    // $effect(() => {
    //     // track plot size, since we're untracking the scales
    //     _plotSize;
    //     _markOptions;

    //     const plotScales = untrack(() => plot.scales);
    //     const context = canvas.getContext('2d');
    //     if (context === null) return;
    //     // this will re-run whenever `color` or `size` change
    //     context.resetTransform();
    //     context.scale(devicePixelRatio, devicePixelRatio);

    //     let currentColor;

    //     path.context(context);

    //     const plot_ = untrack(() => plot);

    //     for (const datum of _filteredData) {
    //         // untrack the filter test to avoid redrawing when not necessary
    //         let { stroke, fill, opacity, ...restStyles } = resolveScaledStyleProps(
    //             datum,
    //             _markOptions,
    //             _usedScales,
    //             plot_,
    //             'fill'
    //         );

    //         const fillOpacity = restStyles['fill-opacity'];
    //         const strokeOpacity = restStyles['stroke-opacity'];

    //         if (`${fill}`.toLowerCase() === 'currentcolor')
    //             fill =
    //                 currentColor ||
    //                 (currentColor = getComputedStyle(
    //                     canvas?.parentElement?.parentElement
    //                 ).getPropertyValue('color'));
    //         if (`${stroke}`.toLowerCase() === 'currentcolor')
    //             stroke =
    //                 currentColor ||
    //                 (currentColor = getComputedStyle(
    //                     canvas?.parentElement?.parentElement
    //                 ).getPropertyValue('color'));
    //         if (CSS_VAR.test(fill))
    //             fill = getComputedStyle(canvas).getPropertyValue(fill.slice(4, -1));
    //         if (CSS_VAR.test(stroke))
    //             stroke = getComputedStyle(canvas).getPropertyValue(stroke.slice(4, -1));

    //         if (stroke && stroke !== 'none') {
    //             const strokeWidth = resolveProp(_markOptions.strokeWidth, datum, 1.6);
    //             context.lineWidth = strokeWidth;
    //         }
    //         context.fillStyle = fill ? fill : 'none';
    //         context.strokeStyle = stroke ? stroke : 'none';

    //         context.beginPath();
    //         path(datum);
    //         context.closePath();

    //         if (opacity != null) context.globalAlpha = opacity ?? 1;
    //         if (fillOpacity != null) context.globalAlpha = (opacity ?? 1) * fillOpacity;

    //         if (fill && fill !== 'none') context.fill();
    //         if (strokeOpacity != null) context.globalAlpha = (opacity ?? 1) * strokeOpacity;
    //         if (stroke && stroke !== 'none') context.stroke();
    //     }
    //     return () => {
    //         canvas?.getContext('2d')?.clearRect(0, 0, canvas?.width, canvas?.height);
    //     };
    // });
</script>

<CanvasLayer {@attach render} />
