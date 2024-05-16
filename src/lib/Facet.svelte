<script lang="ts">
    import { setContext } from 'svelte';
    import { resolveChannel } from './helpers/resolve.js';
    import type { BaseMarkProps, DataRecord, PlotScale, RawValue } from './types.js';
    import { identity } from '$lib/helpers';

    let {
        fx,
        fy,
        fz,
        left,
        top,
        right,
        bottom,
        topEmpty,
        bottomEmpty,
        leftEmpty,
        rightEmpty
    }: {
        fx: RawValue;
        fy: RawValue;
        fz: PlotScale & { toFx: (d: RawValue) => RawValue; toFy: (d: RawValue) => RawValue };
        left: boolean;
        top: boolean;
        right: boolean;
        bottom: boolean;
        topEmpty: boolean;
        bottomEmpty: boolean;
        leftEmpty: boolean;
        rightEmpty: boolean;
    } = $props();

    setContext('svelteplot/facet', {
        getTestFacet() {
            return (datum: DataRecord, options: Partial<BaseMarkProps>) => {
                const toFx = fz ? fz.toFx : identity;
                const toFy = fz ? fz.toFy : identity;
                // console.log('testFacet', { datum, fx, fz, r: resolveChannel('fx', datum, options), t: toFx(resolveChannel('fx', datum, options)) })
                return (
                    (options.fx == null || toFx(resolveChannel('fx', datum, options)) === fx) &&
                    (options.fy == null || toFy(resolveChannel('fy', datum, options)) === fy)
                );
            };
        },
        getFacetState() {
            return {
                fx,
                fy,
                left,
                top,
                right,
                bottom,
                topEmpty,
                bottomEmpty,
                leftEmpty,
                rightEmpty
            };
        }
    });
</script>

<slot />
