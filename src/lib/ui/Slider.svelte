<script lang="ts">
    let {
        label,
        value,
        min = 0,
        max = 100,
        step = 1
    } = $props<{ label: string; value: number; min: Number; max: number }>();
</script>

<label>
    <span>{label}:</span>
    <input type="range" bind:value {min} {max} {step} /> <span class="value">({value})</span>
</label>

<style>
    label {
        display: inline-flex;
        gap: 1ex;
        margin-right: 1em;
    }
    .value {
        opacity: 0.5;
    }
</style>
