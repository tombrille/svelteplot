<!-- @component
    Creates a horizontal line chart with x values and index positions for y
-->
<script lang="ts" generics="Datum extends DataRow">
    interface LineXMarkProps extends Omit<ComponentProps<typeof Line>, 'y' | 'data'> {
        data: Datum[];
    }
    import Line from './Line.svelte';
    import { recordizeX } from 'svelteplot';
    import type { ComponentProps } from 'svelte';
    import type { DataRow } from 'svelteplot';

    let { data = [{} as Datum], ...rest }: LineXMarkProps = $props();

    let args = $derived(recordizeX({ data, ...rest }));
</script>

<Line {...args} />
