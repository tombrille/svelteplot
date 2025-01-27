<script>
    let { label, value = $bindable() } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<label><input type="checkbox" bind:checked={value} /> {@html label}</label>
