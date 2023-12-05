<script lang="ts" context="module">
    import type { BaseMarkProps } from '$lib/types';
</script>

<script lang="ts" generics="T extends BaseMarkProps">
    import type { Plot } from '$lib/classes/Plot.svelte';
    import { Mark } from '$lib/classes/Mark.svelte';
    import { getContext } from 'svelte';

    const plot = getContext<Plot>('svelteplot');

    type Foo = { children?: Function };

    let { type, data = [], channels = [], children, automatic, ...rest } = $props<T & Foo>();

    const mark = new Mark(type, channels, automatic, { data, ...rest });
    // console.log(type, { data, rest });
    plot.addMark(mark);

    $effect(() => {
        // update mark channels
        mark.channels = new Set(channels);
    });

    $effect(() => {
        // update mark channels
        mark.props = { data, ...rest };
    });

    $effect(() => {
        return () => {
            // remove mark from plot
            plot.removeMark(mark);
        };
    });
</script>

<slot />
