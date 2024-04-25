<script lang="ts">
    let { length, children, ...groupProps }: { length: number } = $props();
</script>

{#if length > 1}
    <g {...groupProps}>
       {@render children()}
    </g>
{:else}
    {@render children()}
{/if}
