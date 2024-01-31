<script lang="ts">
    let { count, ...rest } = $props<{ count: number }>();
</script>

{#if count > 1}
    <g {...rest}><slot /></g>
{:else}
    <slot />
{/if}
