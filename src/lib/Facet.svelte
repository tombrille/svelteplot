<script lang="ts">
    import { setContext } from 'svelte';
    import { resolveChannel } from './helpers/resolve.js';
    import type { BaseMarkProps, DataRecord, RawValue } from './types.js';

    let { fx, fy, left, top, right, bottom, topEmpty, bottomEmpty, leftEmpty, rightEmpty } =
        $props<{
            fx: RawValue;
            fy: RawValue;
            left: boolean;
            top: boolean;
            right: boolean;
            bottom: boolean;
            topEmpty: boolean;
            bottomEmpty: boolean;
            leftEmpty: boolean;
            rightEmpty: boolean;
        }>();

    setContext('svelteplot/facet', {
        getTestFacet() {
            return (datum: DataRecord, options: Partial<BaseMarkProps>) => {
                return (
                    (options.fx == null || resolveChannel('fx', datum, options) === fx) &&
                    (options.fy == null || resolveChannel('fy', datum, options) === fy)
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
