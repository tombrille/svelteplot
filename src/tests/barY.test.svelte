<script>
    import { BarY, Plot } from 'svelteplot';
    let { plotArgs, barArgs } = $props();
</script>

<Plot width={100} height={100} axes={false} {...plotArgs}>
    <BarY {...barArgs} />
</Plot>
