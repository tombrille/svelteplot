<script lang="ts">
    import { setContext } from 'svelte';
    import { resolveChannel } from './helpers/resolve.js';
    import type { BaseMarkProps, DataRecord } from './types.js';

    let { fx, fy, firstX, firstY, lastX, lastY } = $props();

    setContext('facet', {
        getTestFacet() {
            return (datum: DataRecord, options: Partial<BaseMarkProps>) => {
                return (
                    (options.fx == null || resolveChannel('fx', datum, options) === fx) &&
                    (options.fy == null || resolveChannel('fy', datum, options) === fy)
                );
            };
        },
        getFacetState() {
            return { fx, fy, firstX, firstY, lastX, lastY };
        }
    });
</script>

<slot />
