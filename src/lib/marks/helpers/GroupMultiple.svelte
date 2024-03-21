<script lang="ts">
    let { length, ...groupProps }: { length: number } = $props();
</script>

{#if length > 1}
    <g {...groupProps}>
        <slot />
    </g>
{:else}
    <slot />
{/if}
