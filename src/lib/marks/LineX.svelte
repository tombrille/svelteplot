<script lang="ts">
    import Line, { type LineMarkProps } from './Line.svelte';
    import { recordizeX, binY } from '$lib/index.js';

    let {
        data,
        interval,
        reduce = 'first',
        ...rest
    } = $props<
        LineMarkProps & {
            interval?: string;
            reduce?: string;
        }
    >();
    let args = $derived(recordizeX<LineMarkProps>({ data, ...rest }));
</script>

<Line {...args} />
