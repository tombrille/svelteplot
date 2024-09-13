<script>
    let { label, value = $bindable() } = $props();
</script>

<label><input type="checkbox" bind:checked={value} /> {@html label}</label>
