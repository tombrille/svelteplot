<script lang="ts">
    import Mark from '../Mark.svelte';
    import GroupMultiple from '$lib/marks/helpers/GroupMultiple.svelte';
    import { getContext } from 'svelte';
    import { recordizeY } from '$lib/transforms/recordize.js';
    import { resolveChannel, resolveProp, resolveScaledStyles } from '../helpers/resolve.js';
    import type {
        PlotContext,
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        FacetContext
    } from '../types.js';
    import { isValid } from '../helpers/isValid.js';
    import { testFilter } from '$lib/helpers/index.js';

    type RuleYMarkProps = BaseMarkProps & {
        data: DataRecord[];
        y?: ChannelAccessor;
        x1?: ChannelAccessor;
        x2?: ChannelAccessor;
        inset?: ConstantAccessor<number>;
        insetLeft?: ConstantAccessor<number>;
        insetRight?: ConstantAccessor<number>;
        dx?: ConstantAccessor<number>;
        dy?: ConstantAccessor<number>;
    };

    let { data, ...options }: RuleYMarkProps = $props();

    const { getPlotState } = getContext<PlotContext>('svelteplot');
    let plot = $derived(getPlotState());

    let args = $derived(recordizeY({ data, ...options }, { withIndex: false }));

    const { getTestFacet } = getContext<FacetContext>('svelteplot/facet');
    let testFacet = $derived(getTestFacet());
</script>

<Mark
    type="ruleY"
    channels={['y', 'x1', 'x2', 'fx', 'fy', 'fz', 'stroke', 'opacity', 'strokeOpacity']}
    {...args}>
    {#snippet children({ mark, usedScales })}
        <GroupMultiple class="rule-y" length={args.data.length}>
            {#each args.data as datum}
                {#if testFacet(datum, mark.options) && testFilter(datum, mark.options)}
                    {@const y_ = resolveChannel('y', datum, args)}
                    {#if isValid(y_)}
                        {@const x1_ = resolveChannel('x1', datum, args)}
                        {@const x2_ = resolveChannel('x2', datum, args)}
                        {@const y = usedScales.y
                            ? plot.scales.y.fn(y_) +
                              (plot.scales.y.type === 'band'
                                  ? plot.scales.y.fn.bandwidth() * 0.5
                                  : 0)
                            : y_}
                        {@const x1 = usedScales.x1
                            ? plot.scales.x.fn(x1_) +
                              (plot.scales.x.type === 'band'
                                  ? plot.scales.x.fn.bandwidth() * 0.5
                                  : 0)
                            : x1_}
                        {@const x2 = usedScales.x2
                            ? plot.scales.x.fn(x2_) +
                              (plot.scales.x.type === 'band'
                                  ? plot.scales.x.fn.bandwidth() * 0.5
                                  : 0)
                            : x2_}
                        {@const inset = resolveProp(args.inset, datum, 0)}
                        {@const insetLeft = resolveProp(args.insetLeft, datum, 0)}
                        {@const insetRight = resolveProp(args.insetRight, datum, 0)}
                        {@const dx = resolveProp(args.dx, datum, 0)}
                        {@const dy = resolveProp(args.dy, datum, 0)}

                        <line
                            data-foo="{x1_} {x2_} - {x1} {x2} {inset} - {insetLeft} - {insetRight}"
                            transform="translate({dx}, {y + dy})"
                            style={resolveScaledStyles(datum, args, usedScales, plot, 'stroke')}
                            x1={(inset || insetLeft) + (x1_ != null ? x1 : plot.options.marginLeft)}
                            x2={(x2_ != null ? x2 : plot.facetWidth + plot.options.marginLeft) -
                                (inset || insetRight)} />
                    {/if}
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>
