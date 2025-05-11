<script lang="ts">
    import Brush, { type BrushMarkProps } from './Brush.svelte';

    let { brush, ...restProps }: Omit<BrushMarkProps, 'limitDimension'> = $props();
</script>

<Brush bind:brush limitDimension="y" {...restProps} />
