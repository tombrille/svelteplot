<!--
    @component
    Useful for adding SVG text labels to your plot.
-->
<script module lang="ts">
    export type TextMarkProps = BaseMarkProps & {
        data: DataRecord[];
        x: ChannelAccessor;
        y: ChannelAccessor;
        children?: Snippet;
        text: ConstantAccessor<string>;
        title?: ConstantAccessor<string>;
        /**
         * if you want to apply class names to individual text elements
         */
        textClass?: ConstantAccessor<string>;
        /**
         * the line anchor for vertical position; top, bottom, or middle
         */
        lineAnchor?: ConstantAccessor<'bottom' | 'top' | 'middle'>;
        /**
         * line height as multiplier of font size
         * @default 1.2
         */
        lineHeight?: ConstantAccessor<number>;
        frameAnchor?: ConstantAccessor<
            | 'bottom'
            | 'top'
            | 'left'
            | 'right'
            | 'top-left'
            | 'bottom-left'
            | 'top-right'
            | 'bottom-right'
        >;
    };
</script>

<script lang="ts">
    import { getContext, type Snippet } from 'svelte';
    import GroupMultiple from './helpers/GroupMultiple.svelte';
    import type {
        DataRecord,
        BaseMarkProps,
        ConstantAccessor,
        ChannelAccessor,
        PlotDefaults
    } from '../types.js';
    import { resolveProp, resolveStyles } from '../helpers/resolve.js';
    import Mark from '../Mark.svelte';
    import { sort } from '$lib/index.js';

    import MultilineText from './helpers/MultilineText.svelte';

    const DEFAULTS = {
        fontSize: 12,
        fontWeight: 500,
        strokeWidth: 1.6,
        frameAnchor: 'center',
        lineHeight: 1.1,
        ...getContext<PlotDefaults>('svelteplot/_defaults').text
    };

    let markProps: TextMarkProps = $props();

    const {
        data = [{}],
        class: className = '',
        ...options
    }: TextMarkProps = $derived({
        ...DEFAULTS,
        ...markProps
    });

    const args = $derived(
        sort({
            data,
            ...options
        })
    ) as TextMarkProps;
</script>

<Mark
    type="text"
    channels={[
        'x',
        'y',
        'r',
        'symbol',
        'fill',
        'stroke',
        'opacity',
        'strokeOpacity',
        'fillOpacity'
    ]}
    required={[]}
    {...args}>
    {#snippet children({ mark, scaledData, usedScales })}
        <GroupMultiple class="text {className}" length={className ? 2 : args.data.length}>
            {#each scaledData as d, i (i)}
                {#if d.valid}
                    {@const textLines = String(resolveProp(args.text, d.datum, '')).split('\n')}

                    <MultilineText {textLines} {d} {args} {usedScales} />
                {/if}
            {/each}
        </GroupMultiple>
    {/snippet}
</Mark>

<style>
    text {
        paint-order: stroke fill;
    }
</style>
