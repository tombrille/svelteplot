<script lang="ts">
    let { count, ...rest }: { count: number } = $props();
</script>

{#if count > 1}
    <g {...rest}><slot /></g>
{:else}
    <slot />
{/if}
