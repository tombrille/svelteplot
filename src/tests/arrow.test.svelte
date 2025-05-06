<script>
    import { Arrow, Plot } from 'svelteplot';
    let args = $props();
</script>

<Plot width={100} height={100} axes={false}>
    <Arrow {...args} />
</Plot>
