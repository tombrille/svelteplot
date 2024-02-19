<script lang="ts">
    let {
        label = '',
        value,
        options,
        format = (d) => d
    } = $props<{
        label?: string;
        value: any;
        options: any[];
        format?: (d: any) => string;
    }>();
</script>

<label
    >{label || ''}
    <select bind:value>
        {#each options as p}
            <option value={p}>{format(p)}</option>
        {/each}
    </select></label
>

<style>
    label {
        margin-right: 1em;
    }
</style>
