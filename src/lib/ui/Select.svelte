<script lang="ts">
    let {
        label = '',
        value,
        options
    } = $props<{
        label?: string;
        value: any;
        options: any[];
    }>();
</script>

<label
    >{label || ''}
    <select bind:value>
        {#each options as p}
            <option value={p}>{p}</option>
        {/each}
    </select></label
>

<style>
    label {
        margin-right: 1em;
    }
</style>
