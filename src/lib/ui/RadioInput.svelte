<script lang="ts">
    let {
        label = '',
        value = $bindable(),
        options,
        format = (d) => d
    }: {
        label?: string;
        value: string | number | undefined;
        options: any[];
        format?: (d: any) => string;
    } = $props();
</script>

<div style="display:inline-block">
    {#if label}
        <label>{label}:</label>
    {/if}
    {#each options as p}
        <label>
            <input type="radio" bind:group={value} value={p} />
            {format(p)}
        </label>
    {/each}
</div>
